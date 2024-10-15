import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: The log-in with email and password endpoint.
 *     tags: [Authentication]
 */
router.post('/', rateLimitTenPerTenMins, CONTROLLERS.AUTH.login)

export default router
