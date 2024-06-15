import { Router } from "express"
import { createUser, getAllUsers, loginUser } from "../controllers/users"
import { authenticateToken } from "../middleware/jwt"

const router = Router()

router
  .get("/", authenticateToken, getAllUsers)
  .post("/register", createUser)
  .post("/login", loginUser)

export default router
