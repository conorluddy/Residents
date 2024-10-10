import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import RBAC from '../../middleware/auth/rbac'
import CONTROLLERS from '../../controllers'
import VALIDATE from '../../middleware/validation'

const router = Router()

/**
 * @swagger
 * /users/meta/{id}:
 *   patch:
 *     summary: Update User Meta
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meta'
 *     responses:
 *       200:
 *         description: User Meta updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully updated user meta.
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/meta/:id',
  authenticateToken,
  RBAC.getTargetUser,
  RBAC.checkCanUpdateUser, // change to use RBAC.checkCanUpdateUserMeta or more fine graied user stuff
  VALIDATE.userMeta,
  CONTROLLERS.USER.updateUserMeta
)

export default router
