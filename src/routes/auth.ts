import { Router } from "express"
import passport from "../passport/google"
import { loginUser } from "../controllers/users/loginUser"
import { googleCallback } from "../controllers/auth/googleCallback"
import { magic } from "../controllers/auth/magic"
import { magicToken } from "../controllers/auth/magicToken"
import { requestPasswordReset } from "../controllers/auth/requestPasswordReset"
import { resetPassword } from "../controllers/auth/resetPassword"

const router = Router()

router
  .post("/", loginUser) // Normal Username and password login
  .get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  )
  .get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    googleCallback
  )
  .get("/magic-login/:token", magicToken)
  .post("/magic-login", magic)
  .post("/request-password-reset", requestPasswordReset)
  .post("/reset-password", resetPassword)

export default router
