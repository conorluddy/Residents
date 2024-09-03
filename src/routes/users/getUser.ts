import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get(
  "/:id",
  authenticateToken,
  RBAC.checkCanGetUsers,
  RBAC.getTargetUserAndEnsureSuperiority,
  CONTROLLERS.USER.getUser
)

export default router
