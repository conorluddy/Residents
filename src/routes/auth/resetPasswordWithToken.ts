import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"

const router = Router()

router.post(
  "/reset-password/:tokenId",
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.resetPasswordWithToken
)

export default router
