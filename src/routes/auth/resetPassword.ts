import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"

const router = Router()

router.post("/reset-password", MW.validateRequestEmail, MW.findUserByValidEmail, CONTROLLERS.AUTH.resetPassword)

export default router
