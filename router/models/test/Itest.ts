import { Document } from "mongoose";
export interface Itest extends Document {
    email:String,
    maths:Number,
    physics:Number,
    chemistry:Number,
    total:Number,
}