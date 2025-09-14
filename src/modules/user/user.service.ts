import AppError from "../../ErrorHelper/AppError";
import { IAuthProvider, Iuser, Role } from "./user.interface";
import { user } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createuserWithCredential = async (payload: Partial<Iuser>) => {
      const { email, password, ...rest } = payload;

      const isuserexist = await user.findOne({ email })
      if (isuserexist) {
            throw new AppError(httpStatus.BAD_REQUEST, "user with this email already exist", "")
      }

      const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

      const authProvider: IAuthProvider = {
            provider: "credential",
            providerId: email || "",
      };

      const newuser = await user.create({
            email,
            password: hashedPassword,
            auth: [authProvider],
            ...rest
      })
      return { newuser }
}

const updateUser = async (userid: string, payload: Partial<Iuser>, deocodedToken: JwtPayload) => {
      const isUserExist = await user.findById(userid)
      if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User dosen't exist", '')
      }
      if (payload.email) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email cannot be changed.", '');
      }
      if (payload.role) {
            if (deocodedToken.role === Role.RIDER || deocodedToken.role === Role.DRIVER) {
                  throw new AppError(httpStatus.FORBIDDEN, "you're not authorized to change the role", '')
            }
      }
      if (payload.status) {
            if (deocodedToken.role !== Role.ADMIN) {
                  throw new AppError(httpStatus.FORBIDDEN, "you're not authorized to change the status", '')

            }
      }
      if (payload.password) {
            payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
      }
      const newUpdateUser = await user.findByIdAndUpdate(userid, payload, { new: true, runValidators: true })
      return newUpdateUser;
}
 
const getAllUser = async () => {
      const alluser = await user.find({});
      const totalUser = await user.countDocuments()
      return {
            data: alluser,
            meta: {
                  total: totalUser,
            }
      }
}

export const userServices = {
      createuserWithCredential,
      updateUser,
      getAllUser
}