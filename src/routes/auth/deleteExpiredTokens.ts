import { Router } from "express"
import CONTROLLERS from "../../controllers"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import { authenticateToken } from "../../middleware/auth/authenticateToken"

const router = Router()

router.delete("/clear-tokens", authenticateToken, RBAC.checkCanClearExpiredTokens, CONTROLLERS.AUTH.deleteExpiredTokens)

export default router
