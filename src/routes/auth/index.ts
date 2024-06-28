import { Router } from "express"
import googleLoginCallback from "./googleLoginCallback"
import login from "./login"
import magicLogin from "./magicLogin"
import magicLoginWithToken from "./magicLoginWithToken"
import resetPassword from "./resetPassword"
import resetPasswordWithToken from "./resetPasswordWithToken"
import googleLogin from "./googleLogin"
import logout from "./logout"
import validateAccount from "./validateAccount"

const router = Router()

router.use(login)
router.use(logout)
router.use(magicLogin)
router.use(magicLoginWithToken)
router.use(resetPassword)
router.use(resetPasswordWithToken)
router.use(validateAccount)

// Passport Strategies
router.use(googleLogin)
router.use(googleLoginCallback)
// ...

export default router
