import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/rbac/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/:id", authenticateToken, RBAC.getTargetUser, RBAC.checkCanGetUser, CONTROLLERS.USER.getUser)

export default router
