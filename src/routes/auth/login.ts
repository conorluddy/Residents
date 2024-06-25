import { Router } from "express"
import { loginUser } from "../../controllers/users/loginUser"

const router = Router()

router.post("/", loginUser)

export default router
