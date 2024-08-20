import { getUserByID, getUserByEmail, getUserPasswordHash } from "./user/getUser"
import { getAllUsers } from "./user/getAllUsers"
import { createToken } from "./auth/createToken"

const SERVICES = {
  getAllUsers,
  getUserByID,
  getUserPasswordHash,
  getUserByEmail,
  //
  createToken,
}

export default SERVICES
