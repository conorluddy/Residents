import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitOncePerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.post("/magic-login", rateLimitOncePerTenMins, CONTROLLERS.AUTH.magicLogin)

export default router
