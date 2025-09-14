import { Types } from "mongoose"

export enum Role {
      RIDER = "Rider",
      DRIVER = "DRIVER",
      ADMIN = "ADMIN"
}
export enum Status {
      ACTIVE = "ACTIVE",
      BLOCK = "BLOCK",
      INACTIVE = "INACTIVE"
}

export interface IAuthProvider {
      provider: "google" | "credential",
      providerId: string
}

export interface Iuser {
      _id: Types.ObjectId,
      name: string,
      email: string,
      password?: string,
      phone?: string,
      picture?: string,
      role: Role,
      status: Status,
      address?: string,
      auth: IAuthProvider[] // user after google login can update password then do login with that password and email

}