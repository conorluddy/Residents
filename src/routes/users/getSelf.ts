import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import CONTROLLERS from "../../controllers"
import RBAC from "../../middleware/auth/roleBasedAccessControl"

const router = Router()

router.get("/self", authenticateToken, RBAC.checkCanGetOwnUser, CONTROLLERS.USER.getSelf)

export default router
