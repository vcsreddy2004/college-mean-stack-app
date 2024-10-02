import { Document } from "mongoose";
export interface Istudent extends Document {
    firstName:string,
    lastName:string,
    email:string,
    joinApproval:boolean,
    password:string
}