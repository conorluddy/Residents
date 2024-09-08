import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/authenticateToken"
import CONTROLLERS from "../../controllers"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import { authoRefresh } from "../../middleware/auth/authoRefresh"

const router = Router()

router.get("/self", authoRefresh, authenticateToken, RBAC.checkCanGetOwnUser, CONTROLLERS.USER.getSelf)

export default router
