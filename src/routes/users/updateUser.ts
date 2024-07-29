import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.patch(
  "/:id",
  authenticateToken,
  RBAC.checkCanUpdateUsers,
  RBAC.getTargetUserAndCheckSuperiority,
  CONTROLLERS.USER.updateUser
)

export default router
