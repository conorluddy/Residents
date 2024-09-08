import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/authenticateToken"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.patch(
  "/:id",
  authenticateToken,
  RBAC.checkCanUpdateUsers,
  RBAC.getTargetUserAndEnsureSuperiority,
  CONTROLLERS.USER.updateUser
)

export default router
