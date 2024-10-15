import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import MW from '../../middleware'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/{tokenId}.{userId}:
 *   patch:
 *     summary: Validate User Account. E.g. a URL sent to new user email where they can confirm their account.
 *     tags: [Authentication]
 */
router.patch(
  '/validate/:tokenId.:userId',
  rateLimitTenPerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.validateAccount
)

export default router
