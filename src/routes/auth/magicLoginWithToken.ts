import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitOncePerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.get("/magic-login/:token", rateLimitOncePerTenMins, CONTROLLERS.AUTH.magicLoginWithToken)

export default router
