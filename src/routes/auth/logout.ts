import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"

const router = Router()

router.get("/logout", MW.authenticateToken, CONTROLLERS.AUTH.logout)

export default router
