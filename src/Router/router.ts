
import { Router } from 'express';
import riderRoute from '../modules/user/rider.route';
import AuthRoute from '../modules/auth/auth.route';
export const router= Router()

const moduleroutes =[
      {
            path:"/rider",
            route:riderRoute
      },
      {
            path:"/auth",
            route:AuthRoute
      }
]
moduleroutes.forEach((route)=>{
      router.use(route.path,route.route)
})