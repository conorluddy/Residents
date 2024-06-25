import { Router } from "express"
import { googlePassport } from "../../passport/google"

const router = Router().get(
  "/google",
  googlePassport.authenticate("google", { scope: ["email", "profile"] })
)

export default router
