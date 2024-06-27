import { Router } from "express"
import { authenticateToken } from "../../middleware/jwt"
import { deleteUser } from "../../controllers/users/deleteUser"
import { canDeleteAnyUser } from "../../middleware/authorization"

const router = Router()

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User deleted
 *       500:
 *         description: Error deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error deleting user
 */
router.delete("/:id", authenticateToken, canDeleteAnyUser, deleteUser)

export default router
