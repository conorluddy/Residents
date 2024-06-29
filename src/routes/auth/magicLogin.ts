import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.post("/magic-login", CONTROLLERS.AUTH.magic)

export default router
