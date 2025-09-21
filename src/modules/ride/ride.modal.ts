import { model, Schema } from "mongoose";
import { GeoJson, IRide, RideHistory } from "./ride.interface";

const GeoJsonSchema = new Schema<GeoJson>(
      {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }
      }, {
      _id: false,
}
)

const RideHistorySchema = new Schema<RideHistory>(
      {
            status: {
                  type: String,
                  enum: [
                        'REQUESTED', 'ACCEPTED', 'PICKED_UP',
                        'IN_TRANSIT', 'COMPLETED', 'CANCELLED',
                  ],
                  required: true,
            },
            timestamp: { type: Date, default: Date.now },
      }, { _id: false }
)
const rideSchema = new Schema<IRide>(
      {
        rider: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        driver: { type: Schema.Types.ObjectId, ref: 'users' },
        pickupLocation: { type: GeoJsonSchema, required: true },
        destinationLocation: { type: GeoJsonSchema, required: true },
        status: {
          type: String,
          enum: [
            'REQUESTED', 'ACCEPTED', 'PICKED_UP',
            'IN_TRANSIT', 'COMPLETED', 'CANCELLED',
          ],
          default: 'REQUESTED',
        },
        fare: { type: Number },
        rideHistory: [RideHistorySchema],
      },
      { timestamps: true, versionKey: false },
    );
    rideSchema.index({ pickupLocation: '2dsphere' });
    // Ride toiri howar shathe shathe ride history-te initial status jog kora
    rideSchema.pre('save', function (next) {
      if (this.isNew) {
        this.rideHistory.push({
          status: this.status,
          timestamp: new Date(),
        } as RideHistory);
      }
      next();
    });
    
    export const Ride = model<IRide>('Ride', rideSchema);