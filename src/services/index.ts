import { getUserByID, getUserByEmail, getUserByUsername, getUserPasswordHash } from "./user/getUser"
import { getAllUsers } from "./user/getAllUsers"
import { createToken } from "./auth/createToken"
import { createUser, createUserMeta } from "./user/createUser"
import { getToken } from "./auth/getToken"
import { deleteToken } from "./auth/deleteToken"
import { deleteRefreshToken } from "./auth/deleteRefreshToken"

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
}

export default SERVICES
