import { Types } from "mongoose";

export type IvehicleDetails = {
      model: string,
      type: "bike" | "car",
      color: string,
      plateNumber: string
}
export interface Idriver {
      user: Types.ObjectId,
      licenseNumber: string,
      licenseImage: string,
      vehicleDetails: IvehicleDetails,
      approvalStatus: "pending" | "approved" | "rejected",
      isAvailable: boolean,
      currentLocation?: {
            type: "Point",
            coordinates: [number, number]//[longitude, latitude]
      }
}