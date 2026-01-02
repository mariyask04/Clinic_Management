import mongoose, { Schema, model } from "mongoose";

const tokenSchema = new Schema({
  tokenNumber : {
    type : String,
    required : true,
    unique : true
  },
  patient :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Patient",
    required : true
  },
  visitDate : {
    type : Date,
    default : Date.now
  },
  status : {
    type : String,
    enum : ["waiting", "in_consultation","completed"],
    default : "waiting"
  }
}, {timestamps : true})

export const Token = model("Token", tokenSchema);