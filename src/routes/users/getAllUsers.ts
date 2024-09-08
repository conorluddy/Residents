import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/authenticateToken"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"
import { authoRefresh } from "../../middleware/auth/authoRefresh"

const router = Router()

router.get("/", authoRefresh, authenticateToken, RBAC.checkCanGetUsers, CONTROLLERS.USER.getAllUsers)

export default router
