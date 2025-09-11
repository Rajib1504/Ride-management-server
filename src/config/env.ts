import dotenv from 'dotenv';
dotenv.config()

interface EnvConfig{
PORT:string,
DB_URL:string,
BCRYPT_SALT_ROUND:string,
NODE_ENV:'development'| 'production',
}

const loadEnvVariables =()=>{
      const reqiredEnvVariables: string[]= ["PORT","DB_URL","BCRYPT_SALT_ROUND","NODE_ENV"]

      reqiredEnvVariables.forEach(key=>{
            if(!process.env[key]){
                  throw new Error(`missing require environment variable ${key}`)
            }
      })
      return{
            PORT :process.env.PORT as string,
            DB_URL: process.env.DB_URL as string,
            BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
            NODE_ENV:process.env.NODE_ENV as 'development'| 'production',
            
      }
}
export const envVars = loadEnvVariables()