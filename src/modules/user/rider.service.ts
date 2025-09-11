import AppError from "../../ErrorHelper/AppError";
import { IAuthProvider, Irider } from "./rider.interface";
import { rider } from "./rider.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";

const createriderWithCredential = async (payload: Partial<Irider>) => {
      const { email , password, ...rest } = payload;

      const isriderexist = await rider.findOne({ email })
      if (isriderexist) {
            throw new AppError(httpStatus.BAD_REQUEST, "rider with this email already exist", "")
      }

      const hashedPassword = await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND));

      const authProvider: IAuthProvider = {
            provider: "credential",
            providerId: email || "",
      };

      const newrider = await rider.create({
            email,
            password:hashedPassword,
            auth:[authProvider],
            ...rest
      })
      return {newrider}
}

export const riderServices = ({
      createriderWithCredential,
})