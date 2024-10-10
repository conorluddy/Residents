import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import RBAC from '../../middleware/auth/rbac'
import CONTROLLERS from '../../controllers'

const router = Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get All Users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       Other:
 *         description: TODO - Swagger Response Schema
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, RBAC.checkCanGetAllUsers, CONTROLLERS.USER.getAllUsers)

export default router
