import mongoose from "mongoose";
import { Itest } from "./Itest";

let testSchema:mongoose.Schema = new mongoose.Schema({
    email:{type:String,require:true},
    maths:{type:Number,require:true},
    physics:{type:Number,require:true},
    chemistry:{type:Number,require:true},
    total:{type:Number,require:true},
});
export default mongoose.model<Itest>("tests",testSchema);