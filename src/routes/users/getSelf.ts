import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { RBAC } from "../../middleware/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/self", authenticateToken, RBAC.checkCanGetSelf, CONTROLLERS.USER.getSelf)

export default router
