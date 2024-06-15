import { Router } from "express"
import { createUser, getAllUsers, loginUser } from "../controllers/users"

const router = Router()

router
  .get("/", getAllUsers)
  .post("/register", createUser)
  .post("/login", loginUser)

export default router
