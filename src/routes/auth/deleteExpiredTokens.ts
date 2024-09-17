import { Router } from "express"
import CONTROLLERS from "../../controllers"
import RBAC from "../../middleware/auth/rbac"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import { rateLimitOncePerTenMins } from "../../middleware/util/rateLimiter"

const router = Router()

router.use(rateLimitOncePerTenMins)

router.delete("/clear-tokens", authenticateToken, RBAC.checkCanClearExpiredTokens, CONTROLLERS.AUTH.deleteExpiredTokens)

export default router
