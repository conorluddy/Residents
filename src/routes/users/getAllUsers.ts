
import { Router } from "express"
import { authenticateToken } from "../../middleware/jwt"
import { getAllUsers } from "../../controllers/users/getAllUsers"

const router = Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", authenticateToken, getAllUsers)

export default router
