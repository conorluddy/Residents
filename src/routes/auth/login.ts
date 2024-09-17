import { Router } from "express"
import CONTROLLERS from "../../controllers"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitTenPerTenMins)

router.post("/", CONTROLLERS.AUTH.login)

export default router
