import express from "express";
import { body, validationResult } from "express-validator";
import { studentView } from "../models/student/studentView";
import { Istudent } from "../models/student/Istudent";
import Student from "../models/student/Student";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
let studentRouter:express.Router = express.Router();
studentRouter.post("/register",[
    body("firstName").not().isEmpty().withMessage("First name can not left empty"),
    body("lastName").not().isEmpty().withMessage("Last name can not left empty"),
    body("email").not().isEmpty().withMessage("email can not left empty"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").not().isEmpty().withMessage("password can not left empty"),
],async(req:express.Request,res:express.Response)=>{
    let error = validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(200).json({
            "error":error
        });
    }
    else
    {
        let studentData:studentView = {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password,
            joinApproval:false,
            token:"",
            errorMessage:""
        }
        let student:Istudent | null = await Student.findOne({email:studentData.email});
        if(student)
        {
            studentData.errorMessage = "student already exist";
            return res.status(200).json(studentData);
        }
        else
        {
            let salt:string = await bcrypt.genSalt(10);
            studentData.password = await bcrypt.hash(studentData.password,salt);
            student = new Student(studentData);
            student.save();
            studentData.errorMessage="";
            return res.status(200).json(studentData);
        }
    }
});studentRouter.post("/login", [
    body("email").not().isEmpty().withMessage("Email cannot be left empty"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").not().isEmpty().withMessage("Password cannot be left empty")
], async (req: express.Request, res: express.Response) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            errorMessage: error.array().map(e => e.msg).join(', ')
        });
    } else {
        let studentData: studentView = {
            firstName: "",
            lastName: "",
            email: req.body.email,
            password: req.body.password,
            token: "",
            errorMessage: "",
            joinApproval: false
        }

        let student: Istudent | null = await Student.findOne({ email: studentData.email });
        if (student) {
            if (await bcrypt.compare(studentData.password, student.password)) {
                if (student.joinApproval) {
                    let payLoad = {
                        firstName: student.firstName,
                        lastName: student.lastName,
                        email: student.email
                    }

                    studentData.token = await jwt.sign(payLoad, config.STUDENT_SECRETE_KEY);
                    return res.status(200).json({ token: studentData.token });
                } else {
                    studentData.errorMessage = "Ask admin to approve your joining";
                    return res.status(403).json(studentData);
                }
            } else {
                studentData.errorMessage = "Invalid password";
                return res.status(400).json(studentData);
            }
        } else {
            studentData.errorMessage = "Email not found";
            return res.status(400).json(studentData);
        }
    }
});
studentRouter.post("/get-student",async(req:express.Request,res:express.Response)=>{
    let studentData:studentView = {
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        token:req.body.token,
        errorMessage:"",
        joinApproval:false
    }
    if(typeof(studentData.token) == "string" && studentData.token !="")
    {
        let payLoad:JwtPayload | string = jwt.verify(studentData.token,config.STUDENT_SECRETE_KEY);
        if(typeof(payLoad) == "string")
        {
            studentData.errorMessage = "Invalid token"
            return res.status(200).json(studentData);
        }
        else
        {
            let student:Istudent | null = await Student.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName}).select("-password");
            if(!student)
            {
                studentData.errorMessage = "invalid token";
                return res.status(200).json(studentData);
            }   
            else
            {
                studentData = {
                    firstName:student.firstName,
                    lastName:student.lastName,
                    email:student.email,
                    password:"",
                    joinApproval:student.joinApproval,
                    errorMessage:"",
                    token:""
                }
                return res.status(200).json(studentData);
            }
        }
    }
});
export default studentRouter;
