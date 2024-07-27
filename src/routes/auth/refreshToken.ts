import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.post("/refresh", CONTROLLERS.AUTH.refreshToken)

export default router
