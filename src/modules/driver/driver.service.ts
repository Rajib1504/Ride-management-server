import { JwtPayload } from "jsonwebtoken";
import { Idriver } from "./driver.inerface";
import { user } from "../user/user.model";
import AppError from "../../ErrorHelper/AppError";
import httpStatus from 'http-status-codes';
import { Driver } from "./driver.model";

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
export const driverService = {
      applicationForDriver,
}
