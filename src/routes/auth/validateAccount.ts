import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import MW from '../../middleware'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/validate/{tokenId}.{userId}:
 *   patch:
 *     summary: Validate User Account
 *     description: Validates a user account using a token sent to the user's email. This endpoint is typically accessed via a URL in the validation email.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the validation token
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to be validated
 *     responses:
 *       200:
 *         description: Account validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account validated successfully
 *       400:
 *         description: Bad request - Invalid user data
 *       401:
 *         description: Unauthorized - Token is missing
 *       403:
 *         description: Forbidden - Invalid validation token
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *       500:
 *         description: Internal Server Error
 *     security: []
 */
router.patch(
  '/validate/:tokenId.:userId',
  rateLimitTenPerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.validateAccount
)

export default router
