import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import RBAC from "../../middleware/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"
import VALIDATE from "../../middleware/validation"

const router = Router()

router.patch(
  "/meta/:id",
  authenticateToken,
  RBAC.checkCanUpdateUsers,
  RBAC.getTargetUserAndCheckSuperiority,
  VALIDATE.userMeta,
  CONTROLLERS.USER.updateUserMeta
)

export default router
