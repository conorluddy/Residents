import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"
import { rateLimitTenPerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitTenPerTenMins)

router.patch("/validate/:tokenId.:userId", MW.VALIDATE.tokenId, MW.findValidTokenById, CONTROLLERS.AUTH.validateAccount)

export default router
