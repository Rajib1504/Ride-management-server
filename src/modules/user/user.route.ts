import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createuserZodSchema, updateZodSchema } from "./user.validation";
import { userControler } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
const userRoute = Router()


userRoute.post('/register', validateRequest(createuserZodSchema), userControler.registerwithCredentials)
userRoute.patch('/:id', validateRequest(updateZodSchema), checkAuth(...Object.values(Role)), userControler.updateUser)
userRoute.get('/all-users', checkAuth(...Object.values(Role.ADMIN)), userControler.allUser)
export default userRoute;