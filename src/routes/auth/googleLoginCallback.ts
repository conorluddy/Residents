import { Router } from 'express'
import { googlePassport } from '../../passport/google'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback for the Google auth flow.
 *     tags: [Authentication]
 */
router.get(
  '/google/callback',
  rateLimitTenPerTenMins,
  googlePassport.authenticate('google', {
    failureRedirect: '/', // TODO: Make this rdr easily configurable
    session: false,
  }),
  CONTROLLERS.AUTH.googleCallback
)

export default router
