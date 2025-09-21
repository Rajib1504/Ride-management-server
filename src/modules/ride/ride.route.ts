import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { requestRideZodSchema, updateRideStatusZodSchema } from './ride.validation';
import { RideControllers } from './ride.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const rideRoute = Router();

rideRoute.post(
  '/request',
  checkAuth(Role.RIDER), // Shudhumatro RIDER-ra request korte parbe
  validateRequest(requestRideZodSchema),
  RideControllers.requestRide,
);
rideRoute.patch('/:rideId/accept', checkAuth(Role.DRIVER), RideControllers.AccptRide);
rideRoute.patch(
  '/:rideId/status',
  checkAuth(Role.DRIVER),
  validateRequest(updateRideStatusZodSchema),
  RideControllers.updateRideStatus,
);
rideRoute.patch(
  '/:rideId/cancel',
  checkAuth(Role.RIDER),
  RideControllers.cancelRide,
);
export default rideRoute;