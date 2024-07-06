import { Router } from "express"
import getAllUsers from "./getAllUsers"
import getUser from "./getUser"
import createUser from "./createUser"
import updateUser from "./updateUser"
import deleteUser from "./deleteUser"
import getSelf from "./getSelf"
import MW from "../../middleware"

const router = Router()

// Middleware
router.use(MW.errorHandler)

// Routes
router.use(createUser)
router.use(updateUser)
router.use(getAllUsers)
router.use(getUser)
router.use(getSelf)
router.use(deleteUser)

export default router
