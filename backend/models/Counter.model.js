import mongoose, { model, Schema } from "mongoose";

const counterSchema = Schema({
    name:{
        type: String,
        unique:true
    },
    value:{
        type:Number,
        default:99
    }
});

export const Counter = model("Counter",counterSchema)