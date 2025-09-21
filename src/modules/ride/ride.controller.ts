import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { RideServices } from './ride.service';
import { JwtPayload } from 'jsonwebtoken';

const requestRide = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as JwtPayload;
    const result = await RideServices.requestRide(req.body, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Ride requested successfully. Waiting for a driver.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const AccptRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rideId } = req.params;
    const user = req.user as JwtPayload;
    const result = await RideServices.AccptRide(rideId, user)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride accepted successfully",
      data: result,
    });

  } catch (error) {
    next(error)

  }
}
const updateRideStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    const user = req.user as JwtPayload;
    const result = await RideServices.updateRideStatus(rideId, status, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Ride status updated to ${result.status} successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const cancelRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rideId } = req.params;
    const user = req.user as JwtPayload;
    const result = await RideServices.cancelRide(rideId, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride cancelled successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getRideHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as JwtPayload;
    const result = await RideServices.getRideHistory(user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ride history retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getPendingRides = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as JwtPayload;
    const result = await RideServices.getPendingRides(user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Pending ride requests retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const RideControllers = {
  requestRide,
  AccptRide,
  updateRideStatus,
  cancelRide,
  getRideHistory,
  getPendingRides
};