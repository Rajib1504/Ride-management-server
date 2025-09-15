import passport from "passport";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import { envVars } from './env';

passport.use(new googleStrategy(
      { clientID: envVars.GOOGLE_CLIENT_ID, clientSecret: envVars.GOOGLE_CLIENT_SECRET, callbackURL: envVars.GOOGLE_CALLBACK_URL }, async()=>{}
))
//forntend 5173 =>backend http://localhost:3000=>passport=>google oAuth consent=>gmail login =>successfull =>google call back url localhost:3000/api/v1/auth/google/callback

//