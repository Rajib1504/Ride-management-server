import { envVars } from "../config/env"
import { Iuser } from "../modules/user/user.interface"
import { user } from "../modules/user/user.model"
import { generateToken } from "./jwt.token"

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
