import { JwtPayload } from 'jsonwebtoken';
import { IRide } from './ride.interface';

import AppError from '../../ErrorHelper/AppError';
import httpStatus from 'http-status-codes';
import { Ride } from './ride.modal';
import { Driver } from '../driver/driver.model';

const requestRide = async (payload: Pick<IRide, 'pickupLocation' | 'destinationLocation'>, decodedToken: JwtPayload) => {
  const { userId } = decodedToken;

  // Check if the rider already has an active ride
  const existingRide = await Ride.findOne({
    rider: userId,
    status: { $in: ['REQUESTED', 'ACCEPTED', 'IN_TRANSIT'] },
  });

  if (existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already have an active ride request.', '');
  }

  // Create a new ride
  const newRideData: Partial<IRide> = {
    rider: userId,
    ...payload,
  };

  const result = await Ride.create(newRideData);
  return result;
};
const AccptRide = async (rideId: string, decodedToken: JwtPayload) => {
      const { userId } = decodedToken;
      const ride = await Ride.findById(rideId)
      if (!ride) {
            throw new AppError(httpStatus.NOT_FOUND, 'Ride request not found!', '');
      }

      if (ride.status !== 'REQUESTED') {
            throw new AppError(httpStatus.BAD_REQUEST, `This ride is already ${ride.status}.`, '');
      }

      const driverProfile = await Driver.findOne({ user: userId });
      if (!driverProfile) {
            throw new AppError(httpStatus.NOT_FOUND, 'Driver profile not found!', '');
      }
      if (!driverProfile.isAvailable) {
            throw new AppError(httpStatus.BAD_REQUEST, 'You are currently offline. Please go online to accept rides.', '');
      }
      // 4. Ride-e driver-ke assign kora ebong status update kora
      ride.driver = userId;
      ride.status = 'ACCEPTED';
      ride.rideHistory.push({ status: 'ACCEPTED', timestamp: new Date() });

      await ride.save();
      return ride;
}

export const RideServices = {
  requestRide,
  AccptRide,
};