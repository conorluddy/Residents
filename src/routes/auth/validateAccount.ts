import { Router } from "express"
import { authenticateToken } from "../../middleware/auth/jsonWebTokens"
import CONTROLLERS from "../../controllers"

const router = Router()

router.patch("/validate/:tokenId.:userId", authenticateToken, CONTROLLERS.AUTH.validateAccount)
// Validate account - needs you to be logged in to validate the account,
// but could be made public if you want to allow for email validation without logging in.

export default router
