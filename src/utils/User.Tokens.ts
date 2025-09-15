import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"
import { Iuser, Status } from "../modules/user/user.interface"
import { user } from "../modules/user/user.model"
import { generateToken, verifyToken } from "./jwt.token"
import AppError from "../ErrorHelper/AppError"
import httpStatus from 'http-status-codes';

export const CreateUserTokens = (user: Partial<Iuser>) => {

      const jwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
      }

      const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
      const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)


      return {
            accessToken, refreshToken
      }
}

export const CreateAccessTokenWithRefreshToken = async (refreshToken: string) => {
      const varifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload


      const isUserAvalible = await user.findOne({ email: varifiedRefreshToken.email })
      if (!isUserAvalible) {
            throw new AppError(httpStatus.BAD_REQUEST, "This user does not exist", '')
      }
      if (isUserAvalible.status === Status.BLOCK || isUserAvalible.status === Status.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserAvalible.status}`, '');
      }


      const jwtPayload = {
            userId: isUserAvalible._id,
            email: isUserAvalible.email,
            role: isUserAvalible.role
      }

      const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

      
      return (accessToken)
}