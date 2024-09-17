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
import xsrfTokens from "../../middleware/auth/xsrfTokens"

const router = Router()

// Middleware
router.use(MW.errorHandler)

// Publicly Exposed Routes
router.use(login)
router.use(magicLogin)
router.use(magicLoginWithToken)
router.use(resetPassword)
router.use(resetPasswordWithToken)
router.use(refreshToken)
router.use(validateAccount)
router.use(googleLogin)
router.use(googleLoginCallback)

// Private Routes
router.use(xsrfTokens) // This middleware must be after the public routes
router.use(logout)
router.use(deleteExpiredTokens)

export default router
