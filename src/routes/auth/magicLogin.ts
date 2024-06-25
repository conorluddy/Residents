import { Router } from "express"
import { magic } from "../../controllers/auth/magic"

const router = Router()

router.post("/magic-login", magic)

export default router
