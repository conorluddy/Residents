import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'
import MW from '../../middleware'

const router = Router()

/**
 * @swagger
 * /auth/magic-login/{tokenId}:
 *   get:
 *     summary: Authenticate user using a magic login token
 *     description: This "magic" URL will be in an email sent to the user, with the magic token in a URL param. It authenticates the user, creates a refresh token, and sets various cookies.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the magic login token
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Bad request - Invalid token ID
 *       403:
 *         description: Forbidden - Token is invalid or expired
 *       404:
 *         description: Not Found - User not found for the given token
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *       500:
 *         description: Internal Server Error
 *     security: []
 */
router.get(
  '/magic-login/:tokenId',
  rateLimitTenPerTenMins,
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  CONTROLLERS.AUTH.magicLoginWithToken
)

export default router
