import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitTenPerTenMins)

router.post(
  "/reset-password/:tokenId",
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.resetPasswordWithToken
)

export default router
