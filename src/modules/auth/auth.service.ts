import AppError from "../../ErrorHelper/AppError";
import { Iuser, Status } from "../user/user.interface";
import { user} from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { generateToken, verifyToken } from "../../utils/jwt.token";
import { envVars } from "../../config/env";
import { CreateAccessTokenWithRefreshToken, CreateUserTokens } from "../../utils/User.Tokens";
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
      const newAccessToken = await CreateAccessTokenWithRefreshToken(refreshToken)
      return {
            accessToken: newAccessToken,
      }
}
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
      const User = await user.findById(decodedToken.userId)
      const isOldPasswordMatch = await bcryptjs.compare(oldPassword, User?.password as string)
      if (!isOldPasswordMatch) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Old password dosn't match", "");

      }
      User!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
      User!.save();
      // return true;
}

export const AuthService = {
      creadentialLogin,
      getNewAccessToken,
      resetPassword,
}