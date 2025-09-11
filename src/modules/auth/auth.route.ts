import { Router } from "express";
import { AuthControler } from "./auth.controller";

const AuthRoute = Router()

AuthRoute.post('/login', AuthControler.login)

export default AuthRoute;