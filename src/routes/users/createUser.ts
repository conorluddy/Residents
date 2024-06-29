import { Router } from "express"
import { RBAC } from "../../middleware/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"

const router = Router()

router.post("/register", RBAC.checkCanCreateUsers, CONTROLLERS.USER.createUser)

export default router
