
import { Router } from 'express';
import userRoute from '../modules/user/user.route';
import AuthRoute from '../modules/auth/auth.route';
import driverRouter from '../modules/driver/driver.routes';
import AdminRouter from '../modules/admin/admin.route';
import rideRoute from '../modules/ride/ride.route';
export const router = Router()

const moduleroutes = [
      {
            path: "/user",
            route: userRoute
      },
      {
            path: "/auth",
            route: AuthRoute
      },
      {
            path: '/drivers',
            route: driverRouter
      },
      {
            path: '/admin',
            route: AdminRouter
      },
      {
            path: '/rides',
            route: rideRoute
      },
]
moduleroutes.forEach((route) => {
      router.use(route.path, route.route)
})