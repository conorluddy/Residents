import { Router } from "express"
import { createUser, getAllUsers, getUser } from "../controllers/users"
import { authenticateToken } from "../middleware/jwt"

const router = Router()

router
  .get("/", authenticateToken, getAllUsers)
  .get("/:id", authenticateToken, getUser)
  .post("/register", createUser)

export default router
