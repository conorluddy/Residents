import { Router } from "express"
import CONTROLLERS from "../../controllers"

const router = Router()

router.post("/", CONTROLLERS.AUTH.login)

export default router
