import mongoose, { model, Schema } from "mongoose";

const billSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Token",
    required: true
  },

  consultationFee: Number,
  medicineFee: Number,
  otherCharges: Number,

  totalAmount: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }
}, { timestamps: true });

export const BillModel = model("Bill", billSchema);