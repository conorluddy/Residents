import { Router } from "express"
import { RBAC } from "../../middleware/roleBasedAccessControl"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"

const router = Router()

router.post("/register", RBAC.checkCanCreateUsers, MW.validateRequestEmail, CONTROLLERS.USER.createUser)

export default router
