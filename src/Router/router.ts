
import { Router } from 'express';
import userRoute from '../modules/user/user.route';
import AuthRoute from '../modules/auth/auth.route';
export const router= Router()

const moduleroutes =[
      {
            path:"/user",
            route:userRoute
      },
      {
            path:"/auth",
            route:AuthRoute
      }
]
moduleroutes.forEach((route)=>{
      router.use(route.path,route.route)
})