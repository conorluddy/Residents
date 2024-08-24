import { getUserByID, getUserByEmail, getUserByUsername, getUserPasswordHash } from "./user/getUser"
import { getAllUsers } from "./user/getAllUsers"
import { createToken } from "./auth/createToken"
import { createUser, createUserMeta } from "./user/createUser"
import { getToken } from "./auth/getToken"
import { deleteToken } from "./auth/deleteToken"
import { deleteRefreshToken } from "./auth/deleteRefreshToken"
import { getUserCount } from "./user/getUserCount"

const SERVICES = {
  createToken,
  createUser,
  createUserMeta,
  deleteRefreshToken,
  deleteToken,
  getAllUsers,
  getToken,
  getUserByEmail,
  getUserByID,
  getUserByUsername,
  getUserPasswordHash,
  getUserCount,
}

export default SERVICES
