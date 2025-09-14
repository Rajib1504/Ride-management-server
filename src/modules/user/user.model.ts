import { model, Schema } from "mongoose"
import { IAuthProvider, Iuser, Role, Status } from "./user.interface"

const authProviderSchema = new Schema<IAuthProvider>({
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
      role: { type: String, enum: Object.values(Role), default: Role.RIDER },
      status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
      auth:[authProviderSchema]

}, {
      timestamps: true,
      versionKey: false
})
export const user = model<Iuser>("users",userSchema);