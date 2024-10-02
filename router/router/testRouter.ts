import express from "express";
import { body, validationResult } from "express-validator";
import { testView } from "../models/test/testView";
import { Itest } from "../models/test/Itest";
import Test from "../models/test/Test";
import { Istudent } from "../models/student/Istudent";
import Student from "../models/student/Student";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { Iadmin } from "../models/admin/Iadmin";
import Admin from "../models/admin/Admin";
let testRouter:express.Router = express.Router();
testRouter.post("/insert",[
    body("email").not().isEmpty().withMessage("email can not left empty"),
    body("email").isEmail().withMessage("Invalid email"),
    body("maths").not().isEmpty().withMessage("maths can not left empty"),
    body("physics").not().isEmpty().withMessage("physics can not left empty"),
    body("chemistry").not().isEmpty().withMessage("chemistry can not left empty"),
    body("token").not().isEmpty().withMessage("token can not left empty"),
],async(req:express.Request,res:express.Response)=>{
    let errors = validationResult(req);
    if(errors.isEmpty())
    {
        try
        {
            let testData:testView = {
                email:req.body.email,
                maths:req.body.maths,
                physics:req.body.physics,
                chemistry:req.body.chemistry,
                total:0,
                token:req.body.token,
                errorMessage:""
            }
            testData.total = Number(testData.maths) + Number(testData.physics) + Number(testData.chemistry);
            if(typeof(testData.token) == "string" && testData.token != "")
            {
                let payLoad:string | JwtPayload = jwt.verify(testData.token,config.ADMIN_SECRETE_KEY);
                if(typeof(payLoad) != "string")
                {
                    let admin:Iadmin | null = await Admin.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName});
                    if(admin)
                    {
                        let test:Itest | null = await Test.findOne({email:testData.email});
                        if(test)
                        {
                            test = await Test.findOneAndUpdate({email:testData.email},{maths:testData.maths,physics:testData.physics,chemistry:testData.chemistry,total:testData.total});
                            test?.save();
                            testData.errorMessage = "";
                            return res.status(200).json(testData);
                        }
                        else
                        {
                            let student:Istudent | null = await Student.findOne({email:testData.email});
                            if(student)
                            {
                                test = new Test(testData);
                                test.save();
                                testData.errorMessage = "";
                                return res.status(200).json(testData);
                            }
                            else
                            {
                                testData.errorMessage = "Invalid student check it";
                                return res.status(200).json(testData);
                            }
                        }
                    }
                    else
                    {
                        testData.errorMessage = "dont be over smart clear tokens from local storage";
                        return res.status(200).json(testData);
                    }
                }
                else
                {
                    testData.errorMessage = "Invalid token";
                    return res.status(200).json(testData);
                }
            }
            else
            {
                testData.errorMessage = "invalid token";
                return res.status(200).json(testData);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else
    {
        return res.status(200).json({
            "errors":errors,
        });
    }
});

testRouter.post("/all-test-data",[
    body("token").not().isEmpty().withMessage("token can not left empty"),
],async(req:express.Request,res:express.Response)=>{
    let errors = validationResult(req);
    if(errors.isEmpty())
    {
        try
        {
            let testData:testView = {
                email:req.body.email,
                maths:req.body.maths,
                physics:req.body.physics,
                chemistry:req.body.chemistry,
                total:0,
                token:req.body.token,
                errorMessage:""
            }
            testData.total = Number(testData.maths) + Number(testData.physics) + Number(testData.chemistry);
            if(typeof(testData.token) == "string" && testData.token != "")
            {
                let payLoad:string | JwtPayload = jwt.verify(testData.token,config.ADMIN_SECRETE_KEY);
                if(typeof(payLoad) != "string")
                {
                    let admin:Iadmin | null = await Admin.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName});
                    if(admin)
                    {
                        let test:Itest[] | null = await Test.find();
                        return res.status(200).json(test);
                    }
                    else
                    {
                        testData.errorMessage = "dont be over smart clear tokens from local storage";
                        return res.status(200).json(testData);
                    }
                }
                else
                {
                    testData.errorMessage = "Invalid token";
                    return res.status(200).json(testData);
                }
            }
            else
            {
                testData.errorMessage = "invalid token";
                return res.status(200).json(testData);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else
    {
        return res.status(200).json({
            "errors":errors,
        });
    }
});
testRouter.post("/clear",async(req:express.Request,res:express.Response)=>{
    try
    {
        let testData:testView = {
            email:req.body.email,
            maths:req.body.email,
            physics:req.body.physics,
            chemistry:req.body.chemistry,
            total:0,
            token:req.body.token,
            errorMessage:""
        }
        testData.total = Number(testData.maths) + Number(testData.physics) + Number(testData.chemistry);
        if(typeof(testData.token) == "string" && testData.token != "")
        {
            let payLoad:string | JwtPayload = jwt.verify(testData.token,config.ADMIN_SECRETE_KEY);
            if(typeof(payLoad) != "string")
            {
                let admin:Iadmin | null = await Admin.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName});
                if(admin)
                {
                    await Test.deleteMany({});
                    testData.errorMessage = "";
                    return res.status(200).json(testData);
                }
                else
                {
                    testData.errorMessage = "dont be over smart clear tokens from local storage";
                    return res.status(200).json(testData);
                }
            }
            else
            {
                testData.errorMessage = "Invalid token";
                return res.status(200).json(testData);
            }
        }
        else
        {
            testData.errorMessage = "invalid token";
            return res.status(200).json(testData);
        }
    }
    catch(err)
    {
        console.log(err);
    }
});
testRouter.post("/test-results",[
    body("token").not().isEmpty().withMessage("token can not left empty"),
],async(req:express.Request,res:express.Response)=>{
    let errors = validationResult(req);
    if(errors.isEmpty())
    {
        try
        {
            let testData:testView = {
                email:"",
                maths:0,
                physics:0,
                chemistry:0,
                total:0,
                token:req.body.token,
                errorMessage:""
            }
            if(typeof(testData.token) == "string" && testData.token != "")
            {
                let payLoad:string | JwtPayload = jwt.verify(testData.token,config.STUDENT_SECRETE_KEY);
                if(typeof(payLoad) != "string")
                {
                    let student:Istudent | null = await Student.findOne({email:payLoad.email,firstName:payLoad.firstName,lastName:payLoad.lastName}).select("-password");
                    if(student)
                    {
                        let test:Itest | null = await Test.findOne({email:payLoad.email});
                        if(test)
                        {
                            testData = {
                                email:"",
                                maths:test.maths,
                                physics:test.physics,
                                chemistry:test.chemistry,
                                total:test.total,
                                token:"",
                                errorMessage:""
                            }
                            return res.status(200).json(testData);
                        }
                        else
                        {
                            testData.errorMessage = "Your data still not updated ask admin to update";
                            return res.status(200).json(testData);
                        }
                    }
                    else
                    {
                        testData.errorMessage = "dont be over smart clear tokens from local storage";
                        return res.status(200).json(testData);
                    }
                }
                else
                {
                    testData.errorMessage = "Invalid token";
                    return res.status(200).json(testData);
                }
            }
            else
            {
                testData.errorMessage = "invalid token";
                return res.status(200).json(testData);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else
    {
        return res.status(200).json({
            "errors":errors,
        });
    }
});
export default testRouter;