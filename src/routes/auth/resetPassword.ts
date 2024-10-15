import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import MW from '../../middleware'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Trigger password reset flow
 *     description: Initiates the password reset process for the provided email address. If the email exists in the system, a reset link will be sent to that address.
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
 *                 description: The email address of the user requesting a password reset
 *     responses:
 *       200:
 *         description: >
 *           Password reset email sent successfully. (Note: This response is returned whether the email exists in the system or not, for security reasons)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check your email for your reset password link.
 *       400:
 *         description: Bad request - invalid email format
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       500:
 *         description: Internal server error
 *     security: []
 */
router.post('/reset-password', rateLimitTenPerTenMins, MW.VALIDATE.email, CONTROLLERS.AUTH.resetPassword)

export default router
