import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { RBAC } from "../../middleware/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.delete(
  "/:id",
  authenticateToken,
  RBAC.checkCanDeleteUsers,
  RBAC.getTargetUserAndCheckSuperiority,
  CONTROLLERS.USER.deleteUser
)

export default router
