import AppError from "../../ErrorHelper/AppError";
import { IAuthProvider, Iuser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";

const createUserWithCredential = async (payload: Partial<Iuser>) => {
      const { email , password, ...rest } = payload;

      const isUserexist = await User.findOne({ email })
      if (isUserexist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User with this email already exist", "")
      }

      const hashedPassword = await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND));

      const authProvider: IAuthProvider = {
            provider: "credential",
            providerId: email || "",
      };

      const newUser = await User.create({
            email,
            password:hashedPassword,
            auth:[authProvider],
            ...rest
      })
      return {newUser}
}

export const UserServices = ({
      createUserWithCredential,
})