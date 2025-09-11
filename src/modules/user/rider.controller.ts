import { NextFunction, Request, Response } from "express";
import { riderServices } from './rider.service';
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const registerwithCredentials = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const rider = await riderServices.createriderWithCredential(req.body)
            sendResponse(res, {
                  success: true,
                  statusCode: (httpStatus.CREATED),
                  message: `rider registered successfully with credentials`,
                  data: rider
            })
      } catch (error) {
            next(error)
      }
}
export const riderControler = ({
      registerwithCredentials,
})