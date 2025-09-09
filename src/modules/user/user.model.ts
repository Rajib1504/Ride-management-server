import { model, Schema } from "mongoose"
import { IAuthProvider, Iuser, Role, Status } from "./user.interface"

const autProviderSchema = new Schema<IAuthProvider>({
      provider: { type: String, required: true },
      providerId: { type: String, required: true }
}, {
      versionKey: false,
      _id: false
})

const userSchema = new Schema<Iuser>({
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String },
      phone: { type: String },
      picture: { type: String },
      address: { type: String },
      role: { type: String, enum: Object.values(Role), default: Role.USER },
      status: { type: String, enum: Object.values(Status), default: Status.ACTIVE }

}, {
      timestamps: true,
      versionKey: false
})
export const User = model<Iuser>("user",userSchema);