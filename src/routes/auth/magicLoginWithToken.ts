import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'
import MW from '../../middleware'

const router = Router()

/**
 * @swagger
 * /auth/magic-login/{tokenId}:
 *   get:
 *     summary: This "magic" URL will be in an email to the user, with the magic token in a URL param.
 *     tags: [Authentication]
 */
router.get(
  '/magic-login/:tokenId',
  rateLimitTenPerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.magicLoginWithToken
)

export default router
