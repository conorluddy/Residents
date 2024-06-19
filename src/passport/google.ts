import passport from "passport"
import Google from "passport-google-oauth20"
import dotenv from "dotenv"
import { logger } from "../utils/logger"

dotenv.config()
const GoogleStrategy = Google.Strategy

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  logger.error("Missing Google OAuth environment variables")
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
        state: false,
      },
      function (accessToken, refreshToken, profile, done) {
        console.log("profile", profile)
        console.log("accessToken", accessToken)
        console.log("refreshToken", refreshToken)

        // Find/Create user...
      }
    )
  )
}

export default passport
