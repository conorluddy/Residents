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
 *     tags: [Authentication]
 */
router.delete(
  '/clear-tokens',
  rateLimitTenPerTenMins,
  authenticateToken,
  RBAC.checkCanClearExpiredTokens,
  CONTROLLERS.AUTH.deleteExpiredTokens
)

export default router
