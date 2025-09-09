import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
import { envVars } from "./config/env";
let server : Server;
dotenv.config()


const startServer = async () => {
      try {
            await mongoose.connect(envVars.DB_URL as string)
            console.log("db is connected");

            server = app.listen(envVars.PORT, () => {
                  console.log(`server is runnign on ${envVars.PORT}`);
            })
      }
      catch (error) {
            console.log(error);
      }
}
startServer()