import dotenv from 'dotenv';
dotenv.config()

interface EnvConfig{
PORT:string,
DB_URL:string
}

const loadEnvVariables =()=>{
      const reqiredEnvVariables: string[]= ["PORT","DB_URL"]

      reqiredEnvVariables.forEach(key=>{
            if(!process.env[key]){
                  throw new Error(`missing require environment variable ${key}`)
            }
      })
      return{
            PORT :process.env.PORT as string,
            DB_URL: process.env.DB_URL as string,
            
      }
}
export const envVars = loadEnvVariables()