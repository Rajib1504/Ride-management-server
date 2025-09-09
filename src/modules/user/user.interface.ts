export enum Role{
      USER= "USER",
      RIDER ="RIDER",
      ADMIN = "ADMIN"
}
export enum Status{
      ACTIVE="ACTIVE",
      BLOCK="BLOCK",
      INACTIVE="INACTIVE"
}

export interface IAuthProvider{
      provider:"google"|"credential",
      providerId:"string"
}

export interface Iuser{
      name:string,
      email:string,
      password?:string,
      mobile?:string,
      picture?:string,
      role:Role,
      status:Status,
      auth:IAuthProvider[] // user after google login can update password then do login with that password and email
      
}