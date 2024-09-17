import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitTenPerTenMins)

router.get("/logout", CONTROLLERS.AUTH.logout)

export default router
