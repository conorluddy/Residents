import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/", authenticateToken, RBAC.checkCanGetUsers, CONTROLLERS.USER.getAllUsers)

export default router
