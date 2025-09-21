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

export const RideControllers = {
  requestRide,
};