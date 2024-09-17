import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"
import MW from "../../middleware"

const router = Router()

router.post("/magic-login", rateLimitTenPerTenMins, MW.VALIDATE.email, CONTROLLERS.AUTH.magicLogin)

export default router
