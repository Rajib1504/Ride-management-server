import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createriderZodSchema } from "./rider.validation";
import { riderControler } from "./rider.controller";

const riderRoute = Router()


riderRoute.post('/register', validateRequest(createriderZodSchema), riderControler.registerwithCredentials)

export default riderRoute;