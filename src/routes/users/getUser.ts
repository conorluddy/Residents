import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { RBAC } from "../../middleware/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get(
  "/:id",
  authenticateToken,
  RBAC.checkCanGetUsers,
  RBAC.getTargetUserAndCheckSuperiority,
  CONTROLLERS.USER.getUser
)

export default router
