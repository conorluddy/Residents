import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import RBAC from '../../middleware/auth/rbac'
import CONTROLLERS from '../../controllers'

const router = Router()

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully updated user.
 *       Other:
 *         description: TODO - Swagger Response Schema
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticateToken, RBAC.getTargetUser, RBAC.checkCanUpdateUser, CONTROLLERS.USER.updateUser)

export default router
