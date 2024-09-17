import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.post(
  "/reset-password/:tokenId",
  rateLimitTenPerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.resetPasswordWithToken
)

export default router
