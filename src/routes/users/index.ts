import { Router } from "express"
import getAllUsers from "./getAllUsers"
import getUser from "./getUser"
import createUser from "./createUser"
import updateUser from "./updateUser"
import deleteUser from "./deleteUser"
import getSelf from "./getSelf"

const router = Router()

router.use(getSelf)
router.use(getUser)
router.use(getAllUsers)
router.use(createUser)
router.use(updateUser)
router.use(deleteUser)

export default router
