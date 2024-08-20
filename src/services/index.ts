import { getUserByID, getUserByEmail, getUserByUsername, getUserPasswordHash } from "./user/getUser"
import { getAllUsers } from "./user/getAllUsers"
import { createToken } from "./auth/createToken"
import { createUser } from "./user/createUser"

const SERVICES = {
  getAllUsers,
  getUserByID,
  getUserPasswordHash,
  getUserByEmail,
  getUserByUsername,

  //
  createUser,
  createToken,
}

export default SERVICES
