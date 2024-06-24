import { Router } from "express"
import getAllUsers from "./getAllUsers"
import getUser from "./getUser"
import createUser from "./createUser"
import updateUser from "./updateUser"
import deleteUser from "./deleteUser"

const router = Router()

router.use(getAllUsers)
router.use(getUser)
router.use(createUser)
router.use(updateUser)
router.use(deleteUser)

export default router
