import { Router } from 'express'
import { googlePassport } from '../../passport/google'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiates the Google login flow
 *     tags: [Authentication]
 */
const router = Router().get(
  '/google',
  rateLimitTenPerTenMins,
  googlePassport.authenticate('google', { scope: ['email', 'profile'] })
)

export default router
