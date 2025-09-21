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
const getEarningsHistory = async (decodedToken: JwtPayload) => {
  const { userId } = decodedToken;

  // Find all completed rides for this driver
  const completedRides = await Ride.find({
    driver: userId,
    status: 'COMPLETED',
  }).populate('rider', 'name phone');

  if (!completedRides || completedRides.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No completed rides found.', '');
  }

  // Calculate total earnings
  const totalEarnings = completedRides.reduce((total, ride) => {
    return total + (ride.fare || 0);
  }, 0);

  return {
    rides: completedRides,
    totalEarnings: parseFloat(totalEarnings.toFixed(2)),
  };
};


export const driverService = {
      applicationForDriver,
      updateAvailability,
      getEarningsHistory,
      
}
