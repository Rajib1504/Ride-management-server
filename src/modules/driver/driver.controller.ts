import { NextFunction, Request, Response } from "express";
import { driverService } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const driverApplication = async (req: Request, res: Response, next: NextFunction) => {
      try {
            if (!req.user) {
                  throw new Error("Unauthorized: User information is missing.");
            }
            const result = await driverService.applicationForDriver(req.body, req.user);
            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.CREATED,
                  message: "Application submitted successfully. Waiting for admin approval.",
                  data: result
            })
      } catch (error) {
            next(error)
      }
}
export const driverController = {
      driverApplication
}