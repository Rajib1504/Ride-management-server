import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await AdminService.updateUserStatus(id, status);

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: 'User status updated successfully',
                  data: result
            })
      } catch (error) {
            next(error)
      }
}
const getAllDriverApplications = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const result = await AdminService.getAllDriverApplications();
            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: 'Pending driver applications retrieved successfully.',
                  data: result,
            });
      } catch (error) {
            next(error)
      }
}
const approvalDriver = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const { id } = req.params
            const result = await AdminService.approvalDriver(id);
            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: 'Driver application approved successfully.',
                  data: result,
            });
      } catch (error) {
            next(error)
      }
}
const rejectDriverApproval = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const { id } = req.params
            const result = await AdminService.rejectDriver(id);
            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: 'Driver application rejected successfully.',
                  data: result,
            });
      } catch (error) {
            next(error)
      }
}


export const adminController = {
      updateUserStatus,
      getAllDriverApplications,
      approvalDriver, rejectDriverApproval
}