import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"
import MW from "../../middleware"

const router = Router()

router.get(
  "/magic-login/:tokenId",
  rateLimitTenPerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.magicLoginWithToken
)

export default router
