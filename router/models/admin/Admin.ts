import mongoose from "mongoose";
import { Iadmin } from "./Iadmin";

let adminSchema:mongoose.Schema = new mongoose.Schema({
    firstName:{type:String,require:true},
    lastName:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true}
});
export default mongoose.model<Iadmin>("Admin",adminSchema);