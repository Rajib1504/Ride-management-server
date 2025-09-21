import { JwtPayload } from 'jsonwebtoken';
import { IRide, IRideStatus } from './ride.interface';

import AppError from '../../ErrorHelper/AppError';
import httpStatus from 'http-status-codes';
import { Ride } from './ride.modal';
import { Driver } from '../driver/driver.model';

const calculateDistance = (
  coords1: [number, number],
  coords2: [number, number],
): number => {
  const R = 6371; // Earth's radius in kilometers
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

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
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this ride.',
      '',
    );
  }

  // Ride-ti completed ba cancelled hoye gele status update kora jabe na
  if (ride.status === 'COMPLETED' || ride.status === 'CANCELLED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot update status. Ride is already ${ride.status}.`,
      '',
    );
  }

  // Status-er shothik sequence check kora
  const validTransitions: { [key in IRideStatus]?: IRideStatus[] } = {
    ACCEPTED: ['PICKED_UP'],
    PICKED_UP: ['IN_TRANSIT'],
    IN_TRANSIT: ['COMPLETED'],
  };

  const allowedNextStatuses = validTransitions[ride.status];
  if (!allowedNextStatuses || !allowedNextStatuses.includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${ride.status} to ${newStatus}.`,
      '',
    );
  }

  // JODI RIDE-TI COMPLETED HOY, TAHLE FARE CALCULATE KORBO
  if (newStatus === 'COMPLETED') {
    const PER_KM_RATE = 20;
    const BASE_FARE = 25;

    const distanceInKm = calculateDistance(
      ride.pickupLocation.coordinates,
      ride.destinationLocation.coordinates,
    );

    const calculatedFare = BASE_FARE + distanceInKm * PER_KM_RATE;
    ride.fare = parseFloat(calculatedFare.toFixed(2));
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


  if (!ride.createdAt) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Could not determine ride creation time.',
      '',
    );
  }
  
  // Shudhumatro je rider ride-ti request koreche, shei cancel korte parbe
  if (ride.rider.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this ride.', '');
  }

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

const getRideHistory = async (decodedToken: JwtPayload) => {
  const { userId, role } = decodedToken;

  let rides;

  if (role === 'Rider') {
    rides = await Ride.find({ rider: userId }).populate('driver', 'name phone');
  } else if (role === 'Driver') {
    rides = await Ride.find({ driver: userId }).populate('rider', 'name phone');
  }

  if (!rides || rides.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No ride history found.', '');
  }

  return rides;
};
const getPendingRides = async (decodedToken: JwtPayload) => {
  const { userId } = decodedToken;
  // console.log('User ID received in getPendingRides service:', userId);

  const driverProfile = await Driver.findOne({ user: userId });
  // console.log('Driver Profile found in DB:', driverProfile);
  if (!driverProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'Driver profile not found!', '');
  }

    if (!driverProfile.currentLocation || !driverProfile.currentLocation.cordinates) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Your location is not set. Please update your location to see nearby ride requests.',
      '',
    );
  }

  if (driverProfile.approvalStatus !== 'approved') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your application is not approved yet.',
      '',
    );
  }

  if (!driverProfile.isAvailable) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are currently offline. Please go online to see ride requests.',
      '',
    );
  }

 const MAX_DISTANCE_IN_METERS = 5000; // 5 kilometers

  const pendingRides = await Ride.find({
    status: 'REQUESTED',
    pickupLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: driverProfile.currentLocation.cordinates,
        },
        $maxDistance: MAX_DISTANCE_IN_METERS,
      },
    },
  }).populate('rider', 'name phone');


  if (!pendingRides || pendingRides.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No pending ride requests found at the moment.',
      '',
    );
  }

  return pendingRides;
};
export const RideServices = {
  requestRide,
  AccptRide,
  updateRideStatus,
  cancelRide,
  getRideHistory,
  getPendingRides

};