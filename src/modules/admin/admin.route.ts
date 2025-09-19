import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserStatusValidationSchema } from "./admin.validation";
import { adminController } from "./admin.controller";

const AdminRouter = Router()

AdminRouter.patch('/users/:id/status', checkAuth(Role.ADMIN), validateRequest(updateUserStatusValidationSchema), adminController.updateUserStatus)
AdminRouter.get('/driver-applications', checkAuth(Role.ADMIN), adminController.getAllDriverApplications)
AdminRouter.patch('/driver-applications/:id/approve', checkAuth(Role.ADMIN), adminController.approvalDriver)
AdminRouter.patch('/driver-applications/:id/reject', checkAuth(Role.ADMIN), adminController.rejectDriverApproval)

export default AdminRouter;