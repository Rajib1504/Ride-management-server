import { NextFunction, Request, Response } from "express";
import { UserServices } from './user.service';
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const registerwithCredentials = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = await UserServices.createUserWithCredential(req.body)
            sendResponse(res, {
                  success: true,
                  statusCode: (httpStatus.CREATED),
                  message: `User registered successfully with credentials`,
                  data: user
            })
      } catch (error) {
            next(error)
      }
}
export const UserControler = ({
      registerwithCredentials,
})