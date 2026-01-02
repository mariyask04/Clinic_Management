import mongoose, { Schema, model } from "mongoose";

const prescriptionSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Token",
    required: true
  },

  diagnosis: {
    type: String
  },

  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }
  ],

  advice: {
    type: String
  },

  followUpDate: {
    type: Date
  }

}, { timestamps: true });

export const Prescription = model("Prescription", prescriptionSchema);