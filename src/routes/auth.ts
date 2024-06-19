import { Router } from "express"
import { loginUser } from "../controllers/users"
import passport from "../passport/google"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../constants/http"
import { JWTUserPayload, generateJwt } from "../utils/jwt"
import { logger } from "../utils/logger"

const router = Router()

router

  // Normal Username and password login
  .post("/", loginUser)

  // Passport logins
  .get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  )
  .get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    (req, res) => {
      try {
        if (!req.user) throw new Error("User not found")
        const token = generateJwt(req.user as JWTUserPayload)
        return res.status(HTTP_SUCCESS.OK).json({ token })
      } catch (error) {
        logger.error(error)
        return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Error logging in")
      }
    }
  )

export default router
