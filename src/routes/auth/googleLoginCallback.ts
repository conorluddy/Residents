import { Router } from 'express'
import { googlePassport } from '../../passport/google'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback for the Google OAuth2 authentication flow
 *     description: This endpoint handles the callback from Google after a user has attempted to authenticate. It completes the OAuth2 flow and logs the user in or creates a new account if it's their first time.
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The authorization code returned by Google
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *       302:
 *         description: Redirection on authentication failure
 *       401:
 *         description: Unauthorized - Authentication failed
 *       500:
 *         description: Internal server error
 *     security: []
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
