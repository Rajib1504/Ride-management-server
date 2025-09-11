import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const login = (async (req: Request, res: Response, next: NextFunction) => {
      const loginfo = await AuthService.creadentialLogin(req.body)

      sendResponse(res, {
            success: true,
            statusCode: (httpStatus.OK),
            message: `Login successfully`,
            data: loginfo
      })
})

export const AuthControler ={
      login,
} 