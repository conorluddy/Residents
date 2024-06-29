import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/logout", CONTROLLERS.AUTH.logout)

export default router
