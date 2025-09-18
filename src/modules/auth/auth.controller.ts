import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import AppError from "../../ErrorHelper/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const login = (async (req: Request, res: Response, next: NextFunction) => {
      const loginfo = await AuthService.creadentialLogin(req.body)
      // res.cookie('refreshToken', loginfo.refreshToken, {
      //       httpOnly: true,
      //       secure: false,
      // })
      // res.cookie('accessToken', loginfo.accessToken, {
      //       httpOnly: true,
      //       secure: false,
      // })

      setAuthCookie(res, loginfo)// sending the details cookie will set in this function and will set in browser.

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
      // res.cookie('accessToken', tokenInfo.accessToken, {
      //       httpOnly: true,
      //       secure: false,
      // })
      setAuthCookie(res, tokenInfo)

      sendResponse(res, {
            success: true,
            statusCode: (httpStatus.OK),
            message: `New access token retrived  successfully`,
            data: tokenInfo
      })
})
const logOut = (async (req: Request, res: Response, next: NextFunction) => {
      try {
            res.clearCookie('accessToken', {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax"
            })
            res.clearCookie("refreshToken", {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax"
            })
            sendResponse(res, {
                  success: true,
                  statusCode: (httpStatus.OK),
                  message: `User Loged Out successfully`,
                  data: null,
            })
      } catch (error) {
            next(error)
      }


})
const resetPassword = (async (req: Request, res: Response, next: NextFunction) => {
      try {
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            const decodedToken = req.user;

            if (!decodedToken) {
                  throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated", '');
            }

            await AuthService.resetPassword(oldPassword, newPassword, decodedToken)

            sendResponse(res, {
                  success: true,
                  statusCode: (httpStatus.OK),
                  message: `password changed successfully`,
                  data: null,
            })

      } catch (error) {
            next(error)
      }


})

export const AuthControler = {
      login,
      getNewAccessToken,
      logOut,
      resetPassword
} 