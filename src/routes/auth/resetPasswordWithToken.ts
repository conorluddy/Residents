import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/request-password/:token", CONTROLLERS.AUTH.requestPasswordReset)

export default router
