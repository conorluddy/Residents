import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/rbac"
import CONTROLLERS from "../../controllers"

const router = Router()

router.delete("/:id", authenticateToken, RBAC.getTargetUser, RBAC.checkCanDeleteUser, CONTROLLERS.USER.deleteUser)

export default router
