import { Document } from "mongoose";
export interface Iadmin extends Document {
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    isAdmin:boolean
}