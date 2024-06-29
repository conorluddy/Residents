import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.post("/reset-password", CONTROLLERS.AUTH.resetPassword)

export default router
