import { JwtPayload } from "jsonwebtoken";
import { Idriver } from "./driver.inerface";
import { user } from "../user/user.model";
import AppError from "../../ErrorHelper/AppError";
import httpStatus from 'http-status-codes';
import { Driver } from "./driver.model";

const applicationForDriver = async (payload: Partial<Idriver>, decodedToken: JwtPayload) => {
      const { email } = decodedToken;
      const isUserExist = await user.findOne({ email });
      if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User dosn't exist", '')
      }

      const existingApplication = await Driver.findOne({ user: isUserExist._id });
      if (existingApplication) {
            throw new AppError(
                  httpStatus.BAD_REQUEST,
                  'You have already applied to become a driver.',
                  '',
            );
      }
      payload.user = isUserExist._id

      const result = await Driver.create(payload);

}
export const driverService = {
      applicationForDriver,
}
