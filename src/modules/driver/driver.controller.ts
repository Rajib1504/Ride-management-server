import { NextFunction, Request, Response } from "express";
import { driverService } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";

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

const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = req.user as JwtPayload
            const { isAvailable } = req.body;
            const result = await driverService.updateAvailability(user, isAvailable);

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: `Driver is now ${result.isAvailable ? 'Online' : 'Offline'}`,
                  data: result,
            });

      } catch (error) {
            next(error)

      }
}
const getEarnings = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = req.user as JwtPayload;
            const result = await driverService.getEarningsHistory(user);

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: 'Earnings history retrieved successfully.',
                  data: result,
            });
      } catch (error) {
            next(error);
      }
};
const updateLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as JwtPayload;
      const { currentLocation } = req.body;
      const result = await driverService.updateCurrentLocation(user, currentLocation);
  
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Driver location updated successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const driverController = {
      driverApplication,
      updateAvailability,
      getEarnings,
      updateLocation

}