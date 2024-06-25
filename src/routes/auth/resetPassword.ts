import { Router } from "express"
import { resetPassword } from "../../controllers/auth/resetPassword"

const router = Router()

router.post("/reset-password", resetPassword)

export default router
