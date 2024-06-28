import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { deleteUser } from "../../controllers/users/deleteUser"
import { RBAC } from "../../middleware/roleBasedAccessControl"

const router = Router()

router.delete("/:id", authenticateToken, RBAC.checkCanDeleteUser, deleteUser)

export default router
