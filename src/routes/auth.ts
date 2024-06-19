import { Router } from "express"
import { loginUser } from "../controllers/users"
import passport from "../passport/google"

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
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => console.log("WELCOME!") // Successful authentication, redirect home....
  )

export default router
