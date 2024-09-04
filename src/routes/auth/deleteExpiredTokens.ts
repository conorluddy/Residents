import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.delete("/clear-tokens", CONTROLLERS.AUTH.deleteExpiredTokens)

export default router
