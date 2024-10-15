import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import MW from '../../middleware'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Will trigger a password refresh flow for the email that is posted, if it exists.
 *     tags: [Authentication]
 */
router.post('/reset-password', rateLimitTenPerTenMins, MW.VALIDATE.email, CONTROLLERS.AUTH.resetPassword)

export default router
