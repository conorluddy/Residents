import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/magic-login/:token", CONTROLLERS.AUTH.magicToken)

export default router
