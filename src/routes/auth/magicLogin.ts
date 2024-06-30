import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.post("/magic-login", CONTROLLERS.AUTH.magicLogin)

export default router
