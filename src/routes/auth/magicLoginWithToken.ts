import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitOncePerTenMins } from "../../middleware/util/rateLimiter"
import MW from "../../middleware"

const router = Router()

router.get(
  "/magic-login/:token",
  rateLimitOncePerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.magicLoginWithToken
)

export default router
