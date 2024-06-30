import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/reset-password/:token", CONTROLLERS.AUTH.resetPasswordWithToken)

export default router
