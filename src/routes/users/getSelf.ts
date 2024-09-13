import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import CONTROLLERS from "../../controllers"
import RBAC from "../../middleware/auth/rbac"

const router = Router()

router.get("/self", authenticateToken, RBAC.getTargetUser, RBAC.checkCanGetUser, CONTROLLERS.USER.getSelf)

export default router
