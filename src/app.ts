import express, { Application, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandeler";
import { router } from "./Router/router";
import cookieParser from "cookie-parser"
import passport from "passport";
import expressSession from 'express-session';
const app: Application = express()


app.use(expressSession({
      secret: 'Your secret',
      resave: false,
      saveUninitialized: false

}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors())


app.use('/api/v1', router)

app.get("/", (req: Request, res: Response) => {
      res.send('Ride server is runnign')
})


app.use(globalErrorHandler)
// not found route will be after our global error handlers 
// app.use(notFound);
export default app;