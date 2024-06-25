import { Router } from "express"
import { magicToken } from "../../controllers/auth/magicToken"

const router = Router()

router.get("/magic-login/:token", magicToken)

export default router
