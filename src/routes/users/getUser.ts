import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import RBAC from '../../middleware/auth/rbac'
import CONTROLLERS from '../../controllers'

const router = Router()

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get User
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       Other:
 *         description: TODO - Swagger Response Schema
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, RBAC.getTargetUser, RBAC.checkCanGetUser, CONTROLLERS.USER.getUser)

export default router
