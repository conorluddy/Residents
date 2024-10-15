import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Issues a fresh JWT and Refresh Token if the correct secure cookies are passed from the client.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully refreshed tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT access token
 *       400:
 *         description: Bad request - Missing refresh token or user ID
 *       403:
 *         description: Forbidden - Invalid, used, or expired token
 *       500:
 *         description: Internal server error
 *     cookies:
 *       refreshToken:
 *         description: HTTP-only cookie containing the refresh token
 *       residentToken:
 *         description: HTTP-only cookie containing the user ID for cross checking with the token
 *       xsrfToken:
 *         description: HTTP-only cookie containing the XSRF token
 */
router.post('/refresh', rateLimitTenPerTenMins, CONTROLLERS.AUTH.refreshToken)

export default router
