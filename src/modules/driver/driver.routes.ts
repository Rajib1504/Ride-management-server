import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { applyForDriverZodSchema, updateAvailabilityZodSchema, updateLocationZodSchema } from "./driver.validation";
import { driverController } from "./driver.controller";

export const driverRouter = Router()

driverRouter.post('/apply', checkAuth(Role.RIDER), validateRequest(applyForDriverZodSchema), driverController.driverApplication)

driverRouter.post('/me/availability', checkAuth(Role.DRIVER), validateRequest(updateAvailabilityZodSchema), driverController.updateAvailability)

driverRouter.get('/me/earnings', checkAuth(Role.DRIVER), driverController.getEarnings);
driverRouter.patch(
      '/me/location',
      checkAuth(Role.DRIVER),
      validateRequest(updateLocationZodSchema),
      driverController.updateLocation
);

export default driverRouter;