import mongoose from "mongoose";
import { Istudent } from "./Istudent";

let studentSchema:mongoose.Schema = new mongoose.Schema({
    firstName:{type:String,require:true},
    lastName:{type:String,require:true},
    email:{type:String,require:true},
    joinApproval:{type:Boolean,default:false},
    password:{type:String,require:true}
});
export default mongoose.model<Istudent>("Student",studentSchema);