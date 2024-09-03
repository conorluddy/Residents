import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.delete(
  "/:id",
  authenticateToken,
  RBAC.checkCanDeleteUsers,
  RBAC.getTargetUserAndEnsureSuperiority,
  CONTROLLERS.USER.deleteUser
)

export default router
