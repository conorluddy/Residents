import { Router } from "express"
import { authenticateToken } from "../middleware/jwt"
import { createUser } from "../controllers/users/createUser"
import { deleteUser } from "../controllers/users/deleteUser"
import { getAllUsers } from "../controllers/users/getAllUsers"
import { getUser } from "../controllers/users/getUser"
import { updateUser } from "../controllers/users/updateUser"

const router = Router()

router
  .get("/", authenticateToken, getAllUsers)
  .get("/:id", authenticateToken, getUser)
  .put("/:id", authenticateToken, updateUser)
  .delete("/:id", authenticateToken, deleteUser)
  .post("/register", createUser)

export default router
