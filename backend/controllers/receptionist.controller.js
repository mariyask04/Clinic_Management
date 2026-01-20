import { Counter } from "../models/Counter.model.js";
import { Patient } from "../models/Patient.model.js";
import { Token } from "../models/Token.model.js";
import { Prescription } from "../models/Prescription.model.js";
import { Bill } from "../models/Bill.model.js";

const addPatient = async (req, res) => {
    try {
        const { fullName, email, phone, age, gender, address } = req.body;
        if (!fullName || !email || !phone || !age || !gender || !address) {
            return res.status(400).json({ success: false, message: "All the fields are required" });
        }
        const patient = new Patient({
            fullName,
            email,
            phone,
            age,
            gender,
            address
        });
        await patient.save()
        res.status(201).json({
            success: true,
            message: "Patient added successfully",
            data: patient,
        });
    } catch (error) {
        console.error("Add Patient Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// const editPatient = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const allowedFields = [
//             "fullName",
//             "email",
//             "phone",
//             "age",
//             "gender",
//             "address"
//         ];
//         const updates = {};
//         allowedFields.forEach((fields) => {
//             if (req.body[fields] !== undefined) {
//                 updates[fields] = req.body[fields]
//             }
//         });
//         if (Object.keys(updates).length === 0) {
//             return res.status(400).json({ success: false, message: "No valid fields are updated" });
//         }
//         const updatedPatient = await Patient.findByIdAndUpdate(
//             id,
//             { $set: updates },
//             { new: true, runValidators: true }
//         );
//         if (!updatedPatient) {
//             return res.status(404).json({ success: false, message: "Patient not found" });
//         }
//         res.status(200).json({ success: true, message: "patient updated successfully", patient: updatedPatient });
//     } catch (error) {
//         console.error("Edit Patient Error : ", error);
//         res.status(500).json({ success: true, message: "Internal Server Error" });
//     }
// };

// const removePatient = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const removedPatient = await Patient.findByIdAndDelete(id);
//         if (!removedPatient) {
//             return res.status(404).json({ success: false, message: "Patient not found" });
//         }
//         await Token.deleteMany({ patient: id });
//         res.status(200).json({ success: true, message: "Patient removed successfully" });
//     } catch (error) {
//         console.error("Remove Patient Error : ", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// }

const generateToken = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ❗ CHECK IF TOKEN ALREADY EXISTS FOR TODAY
        const existingToken = await Token.findOne({
            patient: patientId,
            visitDate: { $gte: today }
        });

        if (existingToken) {
            return res.status(200).json({
                success: true,
                message: "Token already assigned",
                token: existingToken
            });
        }

        const counter = await Counter.findOneAndUpdate(
            { name: "token" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        const token = await Token.create({
            tokenNumber: `P${counter.value}`,
            patient: patientId
        });

        res.status(201).json({
            success: true,
            message: "Token generated successfully",
            token
        });
    } catch (error) {
        console.error("Generate Token Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// const updatePatientStatus = async (req, res) => {
//     try {
//         const { tokenId } = req.params;
//         const { status } = req.body;
//         const allowedStatuses = ["waiting", "in_consultation", "completed"];
//         if (!allowedStatuses.includes(status)) {
//             return res.status(400).json({ success: false, message: "Invalid status" });
//         }
//         const token = await Token.findByIdAndUpdate(
//             tokenId,
//             { status },
//             { new: true },
//         ).populate("patient");
//         if (!token) {
//             return res.status(404).json({ success: false, message: "Token not found" });
//         }
//         res.status(200).json({
//             success: true,
//             message: "Patient status updated successfully",
//             token
//         });
//     } catch (error) {
//         console.error("Update Patient Status Error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }

const generateBill = async (req, res) => {
    try {
        const { patientId, tokenId, items } = req.body;

        if (!patientId || !tokenId || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Patient, token and bill items are required"
            });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

        const token = await Token.findById(tokenId);
        if (!token) return res.status(404).json({ success: false, message: "Token not found" });

        if (token.patient.toString() !== patientId) {
            return res.status(400).json({
                success: false,
                message: "Token does not belong to this patient"
            });
        }

        const existingBill = await Bill.findOne({ token: tokenId });
        if (existingBill) {
            return res.status(400).json({
                success: false,
                message: "Bill already generated for this token"
            });
        }

        const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

        const bill = await Bill.create({
            patient: patientId,
            token: tokenId,
            items,
            totalAmount
        });

        res.status(201).json({
            success: true,
            message: "Bill generated successfully",
            bill
        });

    } catch (error) {
        console.error("Generate Bill Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const markBillAsPaid = async (req, res) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        if (bill.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Bill already paid"
            });
        }

        bill.paymentStatus = "paid";
        await bill.save();

        res.status(200).json({
            success: true,
            message: "Bill marked as paid",
            bill
        });

    } catch (error) {
        console.error("Mark Bill Paid Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export {
    addPatient,
    // editPatient,
    // removePatient,
    generateToken,
    // updatePatientStatus,
    generateBill,
    markBillAsPaid
}