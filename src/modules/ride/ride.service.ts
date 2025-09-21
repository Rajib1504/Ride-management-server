import { JwtPayload } from 'jsonwebtoken';
import { IRide } from './ride.interface';

import AppError from '../../ErrorHelper/AppError';
import httpStatus from 'http-status-codes';
import { Ride } from './ride.modal';

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

export const RideServices = {
  requestRide,
};