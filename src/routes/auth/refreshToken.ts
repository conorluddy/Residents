import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Will issue a fresh JWT and Refresh Token if the posted payload has valid credentials.
 *     tags: [Authentication]
 */
router.post('/refresh', rateLimitTenPerTenMins, CONTROLLERS.AUTH.refreshToken)

export default router
