import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/rbac"
import CONTROLLERS from "../../controllers"
import VALIDATE from "../../middleware/validation"

const router = Router()

router.patch(
  "/meta/:id",
  authenticateToken,
  RBAC.getTargetUser,
  RBAC.checkCanUpdateUser, // change to use RBAC.checkCanUpdateUserMeta or more fine graied user stuff
  VALIDATE.userMeta,
  CONTROLLERS.USER.updateUserMeta
)

export default router
