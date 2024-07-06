import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import CONTROLLERS from "../../controllers"

const router = Router()

router.patch("/validate/:token.:userId", authenticateToken, CONTROLLERS.AUTH.validateAccount)

export default router
