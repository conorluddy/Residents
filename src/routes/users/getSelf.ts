import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import CONTROLLERS from '../../controllers'
import RBAC from '../../middleware/auth/rbac'

const router = Router()

/**
 * @swagger
 * /users/self:
 *   get:
 *     summary: Get Own User
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
router.get('/self', authenticateToken, RBAC.getTargetUser, RBAC.checkCanGetUser, CONTROLLERS.USER.getSelf)

export default router
