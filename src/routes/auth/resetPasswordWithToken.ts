import { Router } from "express"
import { requestPasswordReset } from "../../controllers/auth/requestPasswordReset"

const router = Router()

router.get("/request-password/:token", requestPasswordReset)

export default router
