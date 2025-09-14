import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import AppError from "../../ErrorHelper/AppError";

const login = (async (req: Request, res: Response, next: NextFunction) => {
      const loginfo = await AuthService.creadentialLogin(req.body)
      res.cookie('refreshToken', loginfo.refreshToken, {
            httpOnly: true,
            secure: false,
      })
      res.cookie('accessToken', loginfo.accessToken, {
            httpOnly: true,
            secure: false,
      })
      sendResponse(res, {
            success: true,
            statusCode: (httpStatus.OK),
            message: `Login successfully`,
            data: loginfo
      })
})
const getNewAccessToken = (async (req: Request, res: Response, next: NextFunction) => {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recived form cookie", '');

      }
      const tokenInfo = await AuthService.getNewAccessToken(refreshToken)

      sendResponse(res, {
            success: true,
            statusCode: (httpStatus.OK),
            message: `Login successfully`,
            data: tokenInfo
      })
})

export const AuthControler = {
      login,
      getNewAccessToken
} 