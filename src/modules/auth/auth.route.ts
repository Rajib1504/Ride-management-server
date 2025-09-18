import { Router } from "express";
import { AuthControler } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const AuthRoute = Router()

AuthRoute.post('/login', AuthControler.login)
AuthRoute.post('/refresh-token', AuthControler.getNewAccessToken)
AuthRoute.post('/logout', AuthControler.logOut)
AuthRoute.post('/reset-password', checkAuth(...Object.values(Role)), AuthControler.resetPassword)
export default AuthRoute;