import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/self", authenticateToken, CONTROLLERS.USER.getSelf)

export default router
