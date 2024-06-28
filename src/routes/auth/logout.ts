import { Router } from "express"
import { logoutUser } from "../../controllers/users/logoutUser"

const router = Router()

router.get("/logout", logoutUser)

export default router
