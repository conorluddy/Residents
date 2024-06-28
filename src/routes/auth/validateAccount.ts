import { Router } from "express"
import { authenticateToken } from "../../middleware/jsonWebTokens"
import { validateAccount } from "../../controllers/auth/validateAccount"

const router = Router()

router.get("/validate/:token", authenticateToken, validateAccount)

export default router
