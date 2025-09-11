import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { UserControler } from "./user.controller";

const UserRoute = Router()


UserRoute.post('/register', validateRequest(createUserZodSchema), UserControler.registerwithCredentials)

export default UserRoute;