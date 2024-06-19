import { Router } from "express"
import { loginUser } from "../controllers/users"
import passport from "../passport/google"
import { HTTP_SUCCESS } from "../constants/http"

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
      console.log("\n\n\n\nWELCOME!") // Successful authentication, redirect home....
      console.log(req.user)
      return res.status(HTTP_SUCCESS.OK).send("Welcome!")
    }
  )

export default router
