import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'
import MW from '../../middleware'

const router = Router()

/**
 * @swagger
 * /auth/magic-login:
 *   post:
 *     summary: Trigger the magic login flow
 *     description: Sends an email with a magic login URL to the provided email address. If the email exists in the system, a token is created and sent. For security reasons, the API does not disclose whether the email exists or not.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *     responses:
 *       200:
 *         description: Magic login email sent successfully (or would have been sent if the email exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check your email for your magic login link.
 *       400:
 *         description: Bad request - Invalid email
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
router.post('/magic-login', rateLimitTenPerTenMins, MW.VALIDATE.email, CONTROLLERS.AUTH.magicLogin)

export default router
