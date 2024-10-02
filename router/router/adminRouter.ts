import express from "express";
import { body, validationResult } from "express-validator";
import { Iadmin } from "../models/admin/Iadmin";
import { adminView } from "../models/admin/adminView";
import Admin from "../models/admin/Admin";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { studentView } from "../models/student/studentView";
import { Istudent } from "../models/student/Istudent";
import Student from "../models/student/Student";
import { Itest } from "../models/test/Itest";
import Test from "../models/test/Test";
let adminRouter:express.Router = express.Router();
adminRouter.post("/register",[
    body("firstName").not().isEmpty().withMessage("First name can not left empty"),
    body("lastName").not().isEmpty().withMessage("Last name can not left empty"),
    body("email").not().isEmpty().withMessage("email can not left empty"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").not().isEmpty().withMessage("password can not left empty"),
],async (req:express.Request,res:express.Response)=>{
    let error = validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(200).json({
            "error":error
        });
    }
    else
    {
        let adminData:adminView = {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password,
            token:"",
            errorMessage:""
        }
        let admin:Iadmin | null = await Admin.findOne({email:adminData.email});
        if(admin)
        {
            adminData.errorMessage = "admin already exist";
            return res.status(200).json(adminData);
        }
        else
        {
            let salt:string = await bcrypt.genSalt(10);
            adminData.password = await bcrypt.hash(adminData.password,salt);
            admin = new Admin(adminData);
            admin.save();
            adminData.errorMessage = "";
            adminData.password = "";
            return res.status(200).json(adminData);
        }
    }
});
adminRouter.post("/login", [
    body("email").not().isEmpty().withMessage("Email cannot be left empty"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").not().isEmpty().withMessage("Password cannot be left empty")
], async (req: express.Request, res: express.Response) => {
    // Handle validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorMessage: errors.array().map(e => e.msg).join(', ')
        });
    }
    const adminData: adminView = {
        firstName: "",
        lastName: "",
        email: req.body.email,
        password: req.body.password,
        token: "",
        errorMessage: ""
    };
    try {
        // Check if the admin with the provided email exists
        const admin: Iadmin | null = await Admin.findOne({ email: adminData.email });
        if (admin) {
            // If the admin exists, check if the password is correct
            const isPasswordValid = await bcrypt.compare(adminData.password, admin.password);
            if (isPasswordValid) {
                // Password is correct, generate token
                const tokenPayload = {
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email
                };
                const token = jwt.sign(tokenPayload, config.ADMIN_SECRETE_KEY, { expiresIn: '1h' });

                // Send back the token
                adminData.token = token;
                return res.status(200).json(adminData);
            } else {
                // Password is incorrect
                adminData.errorMessage = "Invalid password"
                return res.status(400).json(adminData);
            }
        } else {
            // Admin with the provided email does not exist
            adminData.errorMessage = "Email does not exist";
            return res.status(400).json(adminData);
        }
    } catch (error) {
        adminData.errorMessage = `An error occurred during login ${error}`;
        return res.status(500).json(adminData);
    }
});
adminRouter.post("/get-data",async(req:express.Request,res:express.Response)=>{
    let adminData:adminView = {
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        token:req.body.token,
        errorMessage:""
    }
    if(typeof(adminData.token) == "string" && adminData.token != "")
    {
        let payLoad:JwtPayload | string = jwt.verify(adminData.token,config.ADMIN_SECRETE_KEY);
        if(typeof(payLoad) != "string")
        {
            let admin:Iadmin | null = await Admin.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName}).select("-password");
            if(admin)
            {
                adminData = {
                    firstName:admin.firstName,
                    lastName:admin.lastName,
                    email:admin.email,
                    password:"",
                    token:"",
                    errorMessage:""
                }
                return res.status(200).json(adminData);
            }   
            else
            {
                adminData.token = "";
                adminData.errorMessage = "Invalid token";
                return res.status(200).json(adminData);
            }
        }
        else
        {
            adminData.token = "";
            adminData.errorMessage = "Invalid token";
            return res.status(200).json(adminData);
        }
    }
    adminData.errorMessage = "Invalid token";
    return res.status(200).json(adminData);
});
adminRouter.post("/join-approval",async (req:express.Request,res:express.Response)=>{
    let studentData:studentView = {
        firstName:"",
        lastName:"",
        email:req.body.email,
        token:req.body.token,
        password:"",
        joinApproval:false,
        errorMessage:""
    }
    if(typeof(studentData.token) == "string")
    {
        let payLoad:JwtPayload | string = jwt.verify(studentData.token,config.ADMIN_SECRETE_KEY);
        if(typeof(payLoad) == "string")
        {
            studentData.errorMessage = "invalid token";
            return res.status(200).json(studentData);
        }
        else
        {
            let admin:Iadmin | null = await Admin.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName});
            if(admin)
            {
                let student:Istudent | null = await Student.findOneAndUpdate({email:studentData.email},{joinApproval:true});
                student?.save();
                studentData.errorMessage = "";
                return res.status(200).json(studentData);
            }
            else
            {
                studentData.errorMessage = "Invalid token";
            }
        }
    }
});
adminRouter.post("/get-student",async(req:express.Request,res:express.Response)=>{
    let payLoad:JwtPayload | string = jwt.verify(req.body.token,config.ADMIN_SECRETE_KEY);
    let studentData:studentView[] = [] as studentView[];
    if(typeof(payLoad) == "string")
    {
        studentData[0].errorMessage = "Invalid token";
    }
    let student:Istudent[] = await Student.find();
    return res.status(200).json(student);
});
adminRouter.post("/delete-student",async (req:express.Request,res:express.Response)=>{
    let studentData:studentView = {
        firstName:"",
        lastName:"",
        email:req.body.email,
        token:req.body.token,
        password:"",
        joinApproval:false,
        errorMessage:""
    }
    if(typeof(studentData.token) == "string")
    {
        let payLoad:JwtPayload | string = jwt.verify(studentData.token,config.ADMIN_SECRETE_KEY);
        if(typeof(payLoad) == "string")
        {
            studentData.errorMessage = "invalid token";
            return res.status(200).json(studentData);
        }
        else
        {
            let admin:Iadmin | null = await Admin.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName});
            if(admin)
            {
                let student:Istudent | null = await Student.findOneAndDelete({email:studentData.email});
                let test:Itest | null = await Test.findOneAndDelete({email:studentData.email});
                studentData.errorMessage = "";
                return res.status(200).json(studentData);
            }
            else
            {
                studentData.errorMessage = "Invalid token";
            }
        }
    }
});
export default adminRouter;