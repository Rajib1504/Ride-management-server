import { JwtPayload } from "jsonwebtoken";
import { Idriver } from "./driver.inerface";
import { user } from "../user/user.model";
import AppError from "../../ErrorHelper/AppError";
import httpStatus from 'http-status-codes';
import { Driver } from "./driver.model";
import { Ride } from "../ride/ride.modal";

const applicationForDriver = async (payload: Partial<Idriver>, decodedToken: JwtPayload) => {
      const { userId } = decodedToken;

      const existingApplication = await Driver.findOne({ user: userId });
      if (existingApplication) {
            throw new AppError(
                  httpStatus.BAD_REQUEST,
                  'You have already applied to become a driver.',
                  '',
            );
      }
      payload.user = userId;

      const result = await Driver.create(payload);
      return result;
}

const updateAvailability = async (decodedToken: JwtPayload, isAvailable: boolean) => {
      const { userId } = decodedToken;

      const driverProfile = await Driver.findOneAndUpdate(
            { user: userId },
            { isAvailable: isAvailable },
            { new: true, runValidators: true }
      )
      if (!driverProfile) {
            throw new AppError(httpStatus.NOT_FOUND, "Driver is not exist", '')
      }
      return driverProfile
}

export const driverService = {
      applicationForDriver,
      updateAvailability,
      
}
