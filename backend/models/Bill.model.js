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

  items: [
    {
      description: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Bill = model("Bill", billSchema);