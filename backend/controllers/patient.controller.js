// controllers/tokenController.js
import { Bill } from "../models/Bill.model.js";
import { Patient } from "../models/Patient.model.js";
import { Prescription } from "../models/Prescription.model.js";
import { Token } from "../models/Token.model.js";

const getTodayPatients = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const patients = await Patient.find({
            createdAt: { $gte: today, $lt: tomorrow }
        }).sort({ createdAt: 1 });

        const formatted = await Promise.all(
            patients.map(async (p) => {
                const token = await Token.findOne({
                    patient: p._id,
                    visitDate: { $gte: today, $lt: tomorrow }
                }).sort({ createdAt: -1 });

                return {
                    id: p._id,
                    fullName: p.fullName,
                    phone: p.phone,
                    visitDate: p.createdAt.toISOString().split("T")[0],
                    status: token ? token.status : "Not Assigned",
                    tokenNumber: token ? token.tokenNumber : "-",
                    tokenId: token ? token._id : null,
                };
            })
        );

        res.status(200).json({
            success: true,
            patients: formatted,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getWaitingPatients = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Get only today's tokens with status = in_consultation
        const tokens = await Token.find({
            status: "in_consultation",
            visitDate: { $gte: today, $lt: tomorrow }
        })
            .populate("patient")
            .sort({ createdAt: 1 });

        // Convert format to frontend format
        const formatted = tokens.map((t) => ({
            id: t.patient._id,
            fullName: t.patient.fullName,
            phone: t.patient.phone,
            visitDate: t.visitDate.toISOString().split("T")[0],
            status: t.status,
            tokenNumber: t.tokenNumber,
            tokenId: t._id
        }));

        res.status(200).json({
            success: true,
            patients: formatted,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getCompletedPatients = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const tokens = await Token.find({
            status: "completed",
            visitDate: { $gte: today, $lt: tomorrow }
        })
            .populate("patient")
            .sort({ createdAt: 1 });

        const formatted = await Promise.all(
            tokens.map(async (t) => {
                const prescription = await Prescription.findOne({ token: t._id });
                const bill = await Bill.findOne({ token: t._id }); // Check if bill exists

                return {
                    id: t.patient._id,
                    fullName: t.patient.fullName,
                    phone: t.patient.phone,
                    visitDate: t.visitDate.toISOString().split("T")[0],
                    status: t.status,
                    tokenNumber: t.tokenNumber,
                    tokenId: t._id,

                    diagnosis: prescription?.diagnosis || "",
                    medicines: prescription?.medicines || [],
                    advice: prescription?.advice || "",
                    tests: prescription?.tests || [],
                    followUpDate: prescription?.followUpDate || null,

                    billGenerated: bill ? true : false,
                    billId: bill?._id || null
                };
            })
        );

        // 🔥 REMOVE patients with bill already generated
        const filteredPatients = formatted.filter(p => !p.billGenerated);

        res.status(200).json({
            success: true,
            patients: filteredPatients,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getPatientFullDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Fetch all tokens (visits)
        const tokens = await Token.find({ patient: id }).sort({ createdAt: -1 });

        // Fetch all prescriptions
        const prescriptions = await Prescription.find({ patient: id })
            .populate("doctor")
            .sort({ createdAt: -1 });

        // Fetch all bills
        const bills = await Bill.find({ patient: id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            patient,
            tokens,
            prescriptions,
            bills,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getPatientHistory = async (req, res) => {
    try {
        const { search, date, status } = req.query;

        // Build filter object
        let filter = {};

        // Status filter
        if (status && status !== "all") {
            filter.status = status;
        }

        // Date filter
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            filter.visitDate = { $gte: start, $lte: end };
        }

        // Fetch tokens/visits with optional search
        let tokensQuery = Token.find(filter)
            .populate("patient") // get patient details
            .sort({ visitDate: -1 }); // latest first

        // Search filter
        if (search) {
            const regex = new RegExp(search, "i");
            tokensQuery = tokensQuery.or([
                { tokenNumber: regex },
                { "patient.fullName": regex },
            ]);
        }

        const tokens = await tokensQuery.exec();

        // Format for frontend
        const history = tokens.map((t) => ({
            id: t.patient?._id || t._id, // <-- Send patient ID here
            tokenNumber: t.tokenNumber,
            fullName: t.patient?.fullName || "Unknown",
            visitDate: t.visitDate.toISOString().split("T")[0], // YYYY-MM-DD
            status: t.status,
            diagnosis: t.diagnosis || "",
            doctor: t.doctor || "",
        }));

        res.status(200).json({ success: true, history });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const { status } = req.body;

        // Allowed statuses
        const allowedStatuses = ["in_consultation", "completed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed: 'in_consultation', 'completed'."
            });
        }

        // Find token
        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        // Transition rules
        if (status === "in_consultation" && token.status !== "waiting") {
            return res.status(400).json({
                message: `Cannot update to 'in_consultation'. Current status is '${token.status}'.`
            });
        }

        if (status === "completed" && token.status !== "in_consultation") {
            return res.status(400).json({
                message: `Cannot update to 'completed'. Current status is '${token.status}'.`
            });
        }

        // Update
        token.status = status;
        await token.save();

        return res.json({
            message: `Status updated to '${status}' successfully`,
            token,
        });

    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    getTodayPatients,
    getWaitingPatients,
    getCompletedPatients,
    getPatientFullDetails,
    getPatientHistory,
    updateStatus
};