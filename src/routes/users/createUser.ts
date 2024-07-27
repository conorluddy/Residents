import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"

const router = Router()

router.post("/register", MW.VALIDATE.email, CONTROLLERS.USER.createUser)
//                      ^
//                      RBAC.checkCanCreateUsers
//                      We can lock this down if we don't
//                      want it to be a public open registration.
//                      Also might want to use a whitelist of domains
//                      for email addresses.

export default router
