import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/validate/:token", authenticateToken, CONTROLLERS.AUTH.validateAccount)

export default router
