import { Types } from "mongoose";

export type GeoJson = {
      type: 'Point',
      coordinates: [number, number] //longitude latitude
}
export type IRideStatus =
      | 'REQUESTED'
      | 'ACCEPTED'
      | 'PICKED_UP'
      | 'IN_TRANSIT'
      | 'COMPLETED'
      | 'CANCELLED';

export type RideHistory = {
      status: IRideStatus;
      timestamp: Date;
};

export interface IRide {
      rider: Types.ObjectId;
      driver?: Types.ObjectId;
      pickupLocation: GeoJson;
      destinationLocation: GeoJson;
      status: IRideStatus;
      rideHistory: RideHistory[]
      fare?: number;
      createdAt?: Date;
      updatedAt?: Date;

}