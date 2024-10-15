import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'
import MW from '../../middleware'

const router = Router()

/**
 * @swagger
 * /auth/reset-password/{tokenId}:
 *   post:
 *     summary: Will reset the password for the user, with the password in the post payload, if token and new password are valid/strong enough.
 *     tags: [Authentication]
 */
router.post(
  '/reset-password/:tokenId',
  rateLimitTenPerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.resetPasswordWithToken
)

export default router
