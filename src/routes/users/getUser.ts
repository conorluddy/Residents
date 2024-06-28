import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { getUser } from "../../controllers/users/getUser"
import { RBAC } from "../../middleware/roleBasedAccessControl"

const router = Router()

router.get("/:id", authenticateToken, RBAC.checkCanGetUsers, RBAC.checkRoleSuperiority, getUser)

export default router
