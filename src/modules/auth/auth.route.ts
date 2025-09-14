import { Router } from "express";
import { AuthControler } from "./auth.controller";

const AuthRoute = Router()

AuthRoute.post('/login', AuthControler.login)
AuthRoute.post('/refresh-token', AuthControler.getNewAccessToken)

export default AuthRoute;