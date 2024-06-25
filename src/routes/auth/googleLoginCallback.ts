import { Router } from "express"
import { googleCallback } from "../../controllers/auth/googleCallback"
import { googlePassport } from "../../passport/google"

const router = Router()

router.get(
  "/google/callback",
  googlePassport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  googleCallback
)

export default router
