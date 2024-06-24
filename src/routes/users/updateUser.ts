import { Router } from "express"
import { authenticateToken } from "../../middleware/jwt"
import { updateUser } from "../../controllers/users/updateUser"

const router = Router()

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUser'
 *       500:
 *         description: Error updating user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error updating user
 */
router.put("/:id", authenticateToken, updateUser)

export default router
