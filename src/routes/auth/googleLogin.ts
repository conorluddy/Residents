import { Router } from 'express'
import { googlePassport } from '../../passport/google'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiates the Google OAuth2 login flow
 *     description: This endpoint starts the Google OAuth2 authentication process.
 *       It redirects the user to Google's login page where they can authorize the application.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google's authentication page
 *       429:
 *         description: Too many requests, please try again later
 */
const router = Router().get(
  '/google',
  rateLimitTenPerTenMins,
  googlePassport.authenticate('google', { scope: ['email', 'profile'] })
)

export default router
