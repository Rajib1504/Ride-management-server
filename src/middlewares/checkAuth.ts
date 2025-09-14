import { NextFunction, Request, Response } from "express";
import AppError from "../ErrorHelper/AppError";
import httpStatus from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
      try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                  throw new AppError(httpStatus.FORBIDDEN, "No token recived", "")
            }
            const verifyToken = jwt.verify(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

            if (!authRoles.includes(verifyToken.role)) {
                  throw new AppError(httpStatus.FORBIDDEN, "you're not authorized to see this route", '')
            }
            req.user = verifyToken;
            next();
      } catch (error) {
            next(error)
      }
}