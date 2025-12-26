import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
    },
    role : {
        type : String,
        enum : ["doctor","receptionist"],
        required : true
    }
},{timestamps : true});

export const User = model("User",userSchema)