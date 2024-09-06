import { getAllUsers } from "./user/getAllUsers"
import { createToken } from "./auth/createToken"
import { createUser } from "./user/createUser"
import { createUserMeta } from "./user/createUserMeta"
import { getToken } from "./auth/getToken"
import { deleteToken } from "./auth/deleteToken"
import { deleteRefreshTokensByUserId } from "./auth/deleteRefreshTokensByUserId"
import { getUserCount } from "./user/getUserCount"
import { updateUserMeta } from "./user/updateUserMeta"
import { updateUser } from "./user/updateUser"
import { updateUserPassword } from "./user/updateUserPassword"
import { updateUserStatus } from "./user/updateUserStatus"
import { updateUserRole } from "./user/updateUserRole"
import { deleteUser } from "./user/deleteUser"
import { getUserByEmail } from "./user/getUserByEmail"
import { getUserById } from "./user/getUserById"
import { getUserByUsername } from "./user/getUserByUsername"
import { getUserPasswordHash } from "./user/getUserPasswordHash"
import { deleteExpiredTokens } from "./auth/deleteExpiredTokens"

const SERVICES = {
  // C
  createToken,
  createUser,
  createUserMeta,
  // R
  getAllUsers,
  getToken,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUserPasswordHash,
  getUserCount,
  // U
  updateUser,
  updateUserMeta,
  updateUserRole,
  updateUserStatus,
  updateUserPassword,
  // D
  deleteRefreshTokensByUserId,
  deleteExpiredTokens,
  deleteToken,
  deleteUser,
  //
}

export default SERVICES
