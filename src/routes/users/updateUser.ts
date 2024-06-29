import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { RBAC } from "../../middleware/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.put("/:id", authenticateToken, RBAC.checkCanUpdateUsers, RBAC.checkRoleSuperiority, CONTROLLERS.USER.updateUser)

export default router
