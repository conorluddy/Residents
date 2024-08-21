import { getUserByID, getUserByEmail, getUserByUsername, getUserPasswordHash } from "./user/getUser"
import { getAllUsers } from "./user/getAllUsers"
import { createToken } from "./auth/createToken"
import { createUser, createUserMeta } from "./user/createUser"

const SERVICES = {
  getAllUsers,
  getUserByID,
  getUserPasswordHash,
  getUserByEmail,
  getUserByUsername,

  //
  createUser,
  createToken,
  createUserMeta,
}

export default SERVICES
