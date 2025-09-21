import { model, Schema } from "mongoose";
import { Idriver, IvehicleDetails } from "./driver.inerface";

const vehicleDetailsSchema = new Schema<IvehicleDetails>(
      {
            type: { type: String, enum: ['bike', 'car'], required: true },
            model: { type: String, required: true },
            color: { type: String, required: true },
            plateNumber: { type: String, unique: true, required: true }
      }, {
      _id: false
}
)

const geoJsonSchema = new Schema({
      type: {
            type: String,
            enum: ['Point'],
            default: "Point",
      },
      coordinates: {
            type: [Number],
            index: "2dsphere"
      },
}, {
      _id: false
})

const driverProfieSchema = new Schema<Idriver>(
      {
            user: {
                  type: Schema.Types.ObjectId,
                  ref: "users",
                  required: true,
                  unique: true
            },
            licenseNumber: { type: String, unique: true, required: true },
            licenseImage: { type: String, unique: true, required: true },
            vehicleDetails: { type: vehicleDetailsSchema, required: true },
            approvalStatus: {
                  type: String,
                  enum: ['pending', 'approved', 'rejected'],
                  default: 'pending'
            },
            isAvailable: { type: Boolean, default: false },
            currentLocation: { type: geoJsonSchema }
      }, { timestamps: true, versionKey: false }
)

export const Driver = model<Idriver>(
      'drivers',
      driverProfieSchema
)