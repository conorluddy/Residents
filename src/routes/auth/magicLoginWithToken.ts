import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitOncePerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitOncePerTenMins)

router.get("/magic-login/:token", CONTROLLERS.AUTH.magicLoginWithToken)

export default router
