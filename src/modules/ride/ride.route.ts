import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { requestRideZodSchema } from './ride.validation';
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

export default rideRoute;