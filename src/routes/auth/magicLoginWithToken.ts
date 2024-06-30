import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.get("/magic-login/:token", CONTROLLERS.AUTH.magicLoginWithToken)

export default router
