import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out and delete user's cookies and refresh token
 *     tags: [Authentication]
 *     description: This endpoint logs out the user by clearing their cookies and deleting their refresh tokens from the database.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully logged out
 *       400:
 *         description: Bad request - Missing user ID
 *       500:
 *         description: Internal server error
 */
router.get('/logout', rateLimitTenPerTenMins, CONTROLLERS.AUTH.logout)

export default router
