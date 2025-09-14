import express, { Application, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandeler";
import { router } from "./Router/router";
import cookieParser from "cookie-parser"
const app:Application = express()

app.use(cookieParser());
app.use(express.json());
app.use(cors())


app.use('/api/v1', router)

app.get("/",(req:Request,res:Response)=>{
      res.send('Ride server is runnign')
})


app.use(globalErrorHandler)
// not found route will be after our global error handlers 
// app.use(notFound);
export default app;