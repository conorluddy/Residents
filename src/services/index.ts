import { createFederatedCredentials, CreateFederatedCredentialsProps } from './auth/createFederatedCredentials'
import { createToken, CreateTokenProps } from './auth/createToken'
import { createUser } from './user/createUser'
import { createUserMeta } from './user/createUserMeta'
import { deleteAllUserTokens, DeleteAllUserTokensProps } from './auth/deleteAllUserTokens'
import { deleteExpiredTokens } from './auth/deleteExpiredTokens'
import { deleteMagicTokensByUserId, DeleteMagicTokensByUserIdProps } from './auth/deleteMagicTokensByUserId'
import { deleteRefreshTokensByUserId, DeleteRefreshTokensByUserIdProps } from './auth/deleteRefreshTokensByUserId'
import { deleteToken, DeleteTokenProps } from './auth/deleteToken'
import { deleteUser, DeleteUserParams } from './user/deleteUser'
import { getAllUsers, GetAllUsersProps } from './user/getAllUsers'
import { getFederatedCredentials, GetFederatedCredentialsProps } from './auth/getFederatedCredentials'
import { getToken, GetTokenProps } from './auth/getToken'
import { getUserByEmail } from './user/getUserByEmail'
import { getUserById } from './user/getUserById'
import { getUserByUsername } from './user/getUserByUsername'
import { getUserCount } from './user/getUserCount'
import { getUserPasswordHash } from './user/getUserPasswordHash'
import { updateUser, UpdateUserParams } from './user/updateUser'
import { updateUserMeta, UpdateUserMetaParams } from './user/updateUserMeta'
import { updateUserPassword, UpdateUserPasswordParams } from './user/updateUserPassword'
import { updateUserRole, UpdateUserRoleParams } from './user/updateUserRole'
import { updateUserStatus, UpdateUserStatusParams } from './user/updateUserStatus'

const SERVICES = {
  // C
  createToken,
  createUser,
  createUserMeta,
  createFederatedCredentials,
  // R
  getAllUsers,
  getToken,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUserPasswordHash,
  getUserCount,
  getFederatedCredentials,
  // U
  updateUser,
  updateUserMeta,
  updateUserRole,
  updateUserStatus,
  updateUserPassword,
  // D
  deleteRefreshTokensByUserId,
  deleteMagicTokensByUserId,
  deleteAllUserTokens,
  deleteExpiredTokens,
  deleteToken,
  deleteUser,
  //
}

export default SERVICES
export {
  CreateFederatedCredentialsProps,
  CreateTokenProps,
  DeleteAllUserTokensProps,
  DeleteMagicTokensByUserIdProps,
  DeleteRefreshTokensByUserIdProps,
  DeleteTokenProps,
  DeleteUserParams,
  GetAllUsersProps,
  GetFederatedCredentialsProps,
  GetTokenProps,
  UpdateUserMetaParams,
  UpdateUserParams,
  UpdateUserPasswordParams,
  UpdateUserRoleParams,
  UpdateUserStatusParams,
}
