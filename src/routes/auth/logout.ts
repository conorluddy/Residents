import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out and delete users cookies and refresh token
 *     tags: [Authentication]
 */
router.get('/logout', rateLimitTenPerTenMins, CONTROLLERS.AUTH.logout)

export default router
