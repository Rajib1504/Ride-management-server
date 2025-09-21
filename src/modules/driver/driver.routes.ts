import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { applyForDriverZodSchema, updateAvailabilityZodSchema } from "./driver.validation";
import { driverController } from "./driver.controller";

const driverRouter = Router()

driverRouter.post('/apply', checkAuth(Role.RIDER), validateRequest(applyForDriverZodSchema), driverController.driverApplication)
driverRouter.post('/me/availability', checkAuth(Role.DRIVER), validateRequest(updateAvailabilityZodSchema), driverController.updateAvailability)

export default driverRouter;