import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import RBAC from '../../middleware/auth/rbac'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/clear-tokens:
 *   delete:
 *     summary: Deletes any expired tokens
 *     description: This endpoint deletes all expired tokens from the database. It's useful for maintaining database hygiene and reducing storage overhead. Only users with appropriate permissions can access this endpoint.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tokens successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "100 expired tokens deleted"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       403:
 *         description: Forbidden - User does not have permission to clear expired tokens
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  '/clear-tokens',
  rateLimitTenPerTenMins,
  authenticateToken,
  RBAC.checkCanClearExpiredTokens,
  CONTROLLERS.AUTH.deleteExpiredTokens
)

export default router
