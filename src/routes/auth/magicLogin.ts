import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitOncePerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitOncePerTenMins)

router.post("/magic-login", CONTROLLERS.AUTH.magicLogin)

export default router
