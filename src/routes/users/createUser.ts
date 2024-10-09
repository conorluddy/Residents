import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import MW from '../../middleware'

const router = Router()

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/register', MW.VALIDATE.email, CONTROLLERS.USER.createUser)
//                      ^
//                      RBAC.checkCanCreateUsers
//                      We can lock this down if we don't
//                      want it to be a public open registration.
//                      Also might want to use a whitelist of domains
//                      for email addresses.

export default router
