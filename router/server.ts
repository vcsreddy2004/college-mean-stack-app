import express from "express";
import config from "./config";
import cors from "cors";
import mongoose from "mongoose";
import adminRouter from "./router/adminRouter";
import studentRouter from "./router/studentRouter";
import testRouter from "./router/testRouter";
let app:express.Application = express();
app.use(cors());
app.use(express.json());
app.use("/api/admin/",adminRouter);
app.use("/api/student/",studentRouter);
app.use("/api/test/",testRouter);
mongoose.connect(config.MONGO_DB_URL).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
});
app.get("/",(req:express.Request,res:express.Response)=>{
    return res.status(200).json({
        "msg":"Express servver is running"
    });
});
if(config.HOST_NAME && config.PORT)
{
    app.listen(config.PORT,config.HOST_NAME,()=>{
        console.log(`Server has started at http://${config.HOST_NAME}:${config.PORT}`);
    });
}