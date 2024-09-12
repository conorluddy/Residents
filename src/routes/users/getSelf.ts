import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import CONTROLLERS from "../../controllers"
import RBAC from "../../middleware/auth/rbac"

const router = Router()

router.get("/self", authenticateToken, RBAC.checkCanAccessOwnData, CONTROLLERS.USER.getSelf)

export default router
