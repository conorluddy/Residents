import { Router } from "express"
import { requestPasswordReset } from "../../controllers/auth/requestPasswordReset"

const router = Router()

router.post("/request-password-with-token", requestPasswordReset)

export default router
