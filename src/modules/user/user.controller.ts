import { NextFunction, Request, Response } from "express";
import { userServices } from './user.service';
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const registerwithCredentials = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = await userServices.createuserWithCredential(req.body)
            sendResponse(res, {
                  success: true,
                  statusCode: (httpStatus.CREATED),
                  message: `user registered successfully with credentials`,
                  data: user
            })
      } catch (error) {
            next(error)
      }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const userId = req.params.id;
            const payload = req.body;
            const verifiedToken = req.user;
            const user = await userServices.updateUser(userId, payload, verifiedToken)
            sendResponse(res, {
                  success: true,
                  statusCode: (httpStatus.CREATED),
                  message: `User updated successfully`,
                  data: user
            })

      } catch (error) {
            next(error)
      }
}
const allUser = async (req: Request, res: Response, next: NextFunction) => {
try{
      const result = await userServices.getAllUser();

      sendResponse(res,{
            success:true,
            statusCode:(httpStatus.OK),
            message:'All users Retrive successfully',
            meta: result.meta,
            data:result.data
      })
}catch(err){
      next(err)
}
}
export const userControler = {
      registerwithCredentials,
      updateUser,
      allUser
}