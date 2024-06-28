import { Router } from "express"
import { createUser } from "../../controllers/users/createUser"
import { RBAC } from "../../middleware/roleBasedAccessControl"

const router = Router()

router.post("/register", RBAC.checkCanCreateUsers, createUser)

export default router
