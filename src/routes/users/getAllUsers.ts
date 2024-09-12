import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import RBAC from "../../middleware/auth/rbac/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/", authenticateToken, RBAC.checkCanGetAllUsers, CONTROLLERS.USER.getAllUsers)

export default router
