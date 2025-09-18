import { NextFunction, Request, Response } from "express";
import AppError from "../ErrorHelper/AppError";
import httpStatus from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envVars } from "../config/env";
import { user } from "../modules/user/user.model";
import { Status } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) =>async (req: Request, res: Response, next: NextFunction) => {
      try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                  throw new AppError(httpStatus.FORBIDDEN, "No token recived", "")
            }
            
            const verifyToken = jwt.verify(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

            


            const isUserAvalible = await user.findOne({ email: verifyToken.email })
            if (!isUserAvalible) {
                  throw new AppError(httpStatus.BAD_REQUEST, "This user does not exist", '')
            }
            if (isUserAvalible.status === Status.BLOCK || isUserAvalible.status === Status.INACTIVE) {
                  throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserAvalible.status}`, '');
            }
      
      
            if (!authRoles.includes(verifyToken.role)) {
                  throw new AppError(httpStatus.FORBIDDEN, "you're not authorized to see this route", '')
            }
            req.user = verifyToken;
            next();
      } catch (error) {
            next(error)
      }
}