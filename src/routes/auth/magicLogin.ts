import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'
import MW from '../../middleware'

const router = Router()

/**
 * @swagger
 * /auth/magic-login:
 *   post:
 *     summary: Trigger the magic login flow, triggering an email with magic URL to the email provided.
 *     tags: [Authentication]
 */
router.post('/magic-login', rateLimitTenPerTenMins, MW.VALIDATE.email, CONTROLLERS.AUTH.magicLogin)

export default router
