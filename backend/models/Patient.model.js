import mongoose, { model, Schema } from "mongoose";

const patientSchema = new Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    phone : {
        type : String,
    },
    age : {
        type : Number,
    },
    gender : {
        type : String,
        enum : ["male","female","other"],
        required : true
    },
    address : {
        type : String,
    },
},{timestamps : true});

export const PatientSchema = model("Patient",patientSchema)