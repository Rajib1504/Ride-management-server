import AppError from "../../ErrorHelper/AppError";
import { Driver } from "../driver/driver.model";
import { Role, Status } from "../user/user.interface";
import { user } from "../user/user.model";
import httpStatus from 'http-status-codes';

const updateUserStatus = async (userId: string, newStatus: Status) => {
      const isUserExist = await user.findById(userId);
      if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User with this id is not found", '')
      }
      const updateUser = await user.findByIdAndUpdate(
            userId,
            { status: newStatus },
            { new: true, runValidators: true }

      )
      return updateUser;
}

const getAllDriverApplications = async () => {
      const applications = await Driver.find({ approvalStatus: 'pending' }).populate('user', '-password')
      if (!applications || applications.length === 0) {
            throw new AppError(httpStatus.NOT_FOUND, 'No pending driver applications found.', '');
      }

      return applications;
}

const approvalDriver = async (applicationId: string) => {
      const application = await Driver.findById(applicationId);
      if (!application) {
            throw new AppError(httpStatus.NOT_FOUND, "Application not found", '')
      }

      application.approvalStatus = "approved"
      await application.save();

      await user.findByIdAndUpdate(application.user, { role: Role.DRIVER });
      return application
}

const rejectDriver = async (applicationId: string) => {
      const application = await Driver.findById(applicationId);
      if (!application) {
            throw new AppError(httpStatus.NOT_FOUND, 'Application not found!', '');
      }

      application.approvalStatus = 'rejected';
      await application.save();

      return application;
}

export const AdminService = {
      updateUserStatus,
      getAllDriverApplications,
      approvalDriver,
      rejectDriver
}