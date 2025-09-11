import AppError from "../../ErrorHelper/AppError";
import { Irider } from "../user/rider.interface";
import { rider } from "../user/rider.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { generateToken } from "../../utils/jwt.token";
import { envVars } from "../../config/env";

const creadentialLogin = async (payload: Partial<Irider>) => {
      const { email, password } = payload;

      const isavalible = await rider.findOne({ email })
      const checkPass = await bcryptjs.compare(password as string, isavalible?.password as string)
      if (!isavalible) {
            throw new AppError(httpStatus.BAD_REQUEST, "This user does not exist please register", '')
      }
      if (!checkPass) {
            throw new AppError(httpStatus.BAD_REQUEST, "Wrong passowrd", "");

      }

      const jwtPayload = {
            riderId: isavalible._id,
            email: isavalible.email,
            role: isavalible.role
      }

      const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
      return (accessToken)
}

export const AuthService = {
      creadentialLogin,
}