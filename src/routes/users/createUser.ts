import { Router } from "express"
import { createUser } from "../../controllers/users/createUser"

const router = Router()

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User registered
 *       500:
 *         description: Error registering user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error registering user
 */
router.post("/register", createUser)

export default router
