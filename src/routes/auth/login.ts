import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.post("/", rateLimitTenPerTenMins, CONTROLLERS.AUTH.login)

export default router
