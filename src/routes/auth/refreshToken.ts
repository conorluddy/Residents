import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitOncePerTenMins, rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitOncePerTenMins)

router.post("/refresh", CONTROLLERS.AUTH.refreshToken)

export default router
