import { JwtPayload } from 'jsonwebtoken';
import { IRide, IRideStatus } from './ride.interface';

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
const updateRideStatus = async (rideId: string, newStatus: IRideStatus, decodedToken: JwtPayload) => {
  const { userId } = decodedToken;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ride not found!', '');
  }

  // Shudhumatro ei ride-er jonno assign kora driver-i status update korte parbe
  if (ride.driver?.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this ride.', '');
  }

  // Ride-ti completed ba cancelled hoye gele status update kora jabe na
  if (ride.status === 'COMPLETED' || ride.status === 'CANCELLED') {
    throw new AppError(httpStatus.BAD_REQUEST, `Cannot update status. Ride is already ${ride.status}.`, '');
  }

  // Status-er shothik sequence check kora
  const validTransitions: { [key in IRideStatus]?: IRideStatus[] } = {
    ACCEPTED: ['PICKED_UP'],
    PICKED_UP: ['IN_TRANSIT'],
    IN_TRANSIT: ['COMPLETED'],
  };

  const allowedNextStatuses = validTransitions[ride.status];
  if (!allowedNextStatuses || !allowedNextStatuses.includes(newStatus)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid status transition from ${ride.status} to ${newStatus}.`, '');
  }

  // Status update kora
  ride.status = newStatus;
  ride.rideHistory.push({ status: newStatus, timestamp: new Date() });

  await ride.save();
  return ride;
};

const cancelRide = async (rideId: string, decodedToken: JwtPayload) => {
  const { userId } = decodedToken;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ride not found!', '');
  }

  // Shudhumatro je rider ride-ti request koreche, shei cancel korte parbe
  if (ride.rider.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this ride.', '');
  }

  // Shudhumatro 'REQUESTED' status-ei ride cancel kora jabe
  if (ride.status !== 'REQUESTED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot cancel this ride as it is already ${ride.status}.`,
      '',
    );
  }

  ride.status = 'CANCELLED';
  ride.rideHistory.push({ status: 'CANCELLED', timestamp: new Date() });

  await ride.save();
  return ride;
};

export const RideServices = {
  requestRide,
  AccptRide,
  updateRideStatus,
  cancelRide
};