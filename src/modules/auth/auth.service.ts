import AppError from "../../ErrorHelper/AppError";
import { Iuser, Status } from "../user/user.interface";
import { user } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { generateToken, verifyToken } from "../../utils/jwt.token";
import { envVars } from "../../config/env";
import { CreateUserTokens } from "../../utils/User.Tokens";
import { JwtPayload } from "jsonwebtoken";

const creadentialLogin = async (payload: Partial<Iuser>) => {
      const { email, password } = payload;
      // console.log("is email coming",email);

      const isUserAvalible = await user.findOne({ email })
      const checkPass = await bcryptjs.compare(password as string, isUserAvalible?.password as string)
      if (!isUserAvalible) {
            throw new AppError(httpStatus.BAD_REQUEST, "This user does not exist please register", '')
      }
      if (!checkPass) {
            throw new AppError(httpStatus.BAD_REQUEST, "Wrong passowrd", "");

      }

      //       const jwtPayload = {
      //             userId: isUserAvalible._id,
      //             email: isUserAvalible.email,
      //             role: isUserAvalible.role
      //       }

      //       const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
      //       const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRES_SECRET, envVars.JWT_REFRESH_EXPIRES)
      const usertokens = CreateUserTokens(isUserAvalible)

      const { password: pass, ...rest } = isUserAvalible.toObject();
      return {
            accessToken: usertokens.accessToken,
            refreshToken: usertokens.refreshToken,
            user: rest,
      }
}
const getNewAccessToken = async (refreshToken: string) => {
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

      const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
      return {
            accessToken: accessToken,
      }
}

export const AuthService = {
      creadentialLogin,
      getNewAccessToken,
}