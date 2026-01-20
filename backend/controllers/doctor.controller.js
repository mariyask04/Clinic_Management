import { Patient } from "../models/Patient.model.js";
import { Prescription } from "../models/Prescription.model.js";
import { Token } from "../models/Token.model.js";

const createPrescription = async (req, res) => {
    try {
        const doctorId = req.user.id; // doctor from JWT middleware
        const { patientId, tokenId } = req.params;

        const {
            chiefComplaint,
            diagnosis,
            medicines,
            advice,
            reports,
            followUpDate
        } = req.body;

        // Validate patient
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Validate token
        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        // Ensure token belongs to patient
        if (token.patient.toString() !== patientId) {
            return res.status(400).json({
                message: "Token does not belong to the given patient"
            });
        }

        // Ensure token is in consultation stage
        if (token.status !== "in_consultation") {
            return res.status(400).json({
                message: `Cannot write prescription. Token is in '${token.status}' state`
            });
        }

        // Create prescription
        const prescription = await Prescription.create({
            patient: patientId,
            doctor: doctorId,
            token: tokenId,
            diagnosis,
            medicines,
            advice,
            followUpDate,
            chiefComplaint,
            reports
        });

        // Update token status → completed
        token.status = "completed";
        await token.save();

        return res.status(201).json({
            success: true,
            message: "Prescription created successfully",
            prescription
        });

    } catch (error) {
        console.error("Prescription creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { createPrescription };