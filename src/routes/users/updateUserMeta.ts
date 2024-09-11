import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"
import VALIDATE from "../../middleware/validation"

const router = Router()

router.patch(
  "/meta/:id",
  authenticateToken,
  RBAC.getTargetUser,
  RBAC.checkCanUpdateUsers,
  VALIDATE.userMeta,
  CONTROLLERS.USER.updateUserMeta
)

export default router
