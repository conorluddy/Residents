import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.post("/reset-password", rateLimitTenPerTenMins, MW.VALIDATE.email, CONTROLLERS.AUTH.resetPassword)

export default router
