import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"

const router = Router()

router.post(
  "/reset-password/:token",
  MW.VALIDATE.token,
  MW.findUserByValidToken,
  MW.discardToken,
  CONTROLLERS.AUTH.resetPasswordWithToken
)

export default router
