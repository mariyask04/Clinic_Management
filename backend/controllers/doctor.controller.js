import { Prescription } from "../models/Prescription.model.js";
import { Token } from "../models/Token.model.js";

const writePrescription = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { patientId, tokenId, diagnosis, medicines, advice, followUpDate } = req.body;

    if (!patientId || !tokenId) {
      return res.status(400).json({
        success: false,
        message: "Patient and token are required"
      });
    }

    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found"
      });
    }

    if (token.status !== "in_consultation") {
      return res.status(400).json({
        success: false,
        message: "Consultation not active"
      });
    }

    const existingPrescription = await Prescription.findOne({ token: tokenId });
    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: "Prescription already exists"
      });
    }

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: doctorId,
      token: tokenId,
      diagnosis,
      medicines,
      advice,
      followUpDate
    });

    token.status = "completed";
    await token.save();

    res.status(201).json({
      success: true,
      message: "Prescription saved successfully",
      prescription
    });

  } catch (error) {
    console.error("Write Prescription Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { writePrescription };