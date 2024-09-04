import { Router } from "express"
import googleLoginCallback from "./googleLoginCallback"
import login from "./login"
import magicLogin from "./magicLogin"
import magicLoginWithToken from "./magicLoginWithToken"
import resetPassword from "./resetPassword"
import resetPasswordWithToken from "./resetPasswordWithToken"
import refreshToken from "./refreshToken"
import googleLogin from "./googleLogin"
import logout from "./logout"
import validateAccount from "./validateAccount"
import MW from "../../middleware"
import deleteExpiredTokens from "./deleteExpiredTokens"

const router = Router()

// Middleware
router.use(MW.errorHandler)

// Routes
router.use(login)
router.use(logout)
router.use(magicLogin)
router.use(magicLoginWithToken)
router.use(resetPassword)
router.use(resetPasswordWithToken)
router.use(validateAccount)
router.use(refreshToken)
router.use(deleteExpiredTokens)

// Passport Strategies
router.use(googleLogin)
router.use(googleLoginCallback)
// ...

export default router
