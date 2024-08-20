import { getUserByID, getUserByEmail, getUserByUsername, getUserPasswordHash } from "./user/getUser"
import { getAllUsers } from "./user/getAllUsers"
import { createToken } from "./auth/createToken"

const SERVICES = {
  getAllUsers,
  getUserByID,
  getUserPasswordHash,
  getUserByEmail,
  getUserByUsername,

  //
  createToken,
}

export default SERVICES
