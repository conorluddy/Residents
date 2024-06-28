import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { updateUser } from "../../controllers/users/updateUser"
import { RBAC } from "../../middleware/roleBasedAccessControl"

const router = Router()

router.put("/:id", authenticateToken, RBAC.checkCanUpdateUsers, RBAC.checkRoleSuperiority, updateUser)

export default router
