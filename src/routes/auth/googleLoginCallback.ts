import { Router } from "express"
import { googlePassport } from "../../passport/google"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get(
  "/google/callback",
  googlePassport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  CONTROLLERS.AUTH.googleCallback
)

export default router
