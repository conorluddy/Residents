import { NextFunction, Request, Response } from "express"
import { ACL, PERMISSIONS } from "../../../constants/accessControlList"
import { ROLES, ROLES_ARRAY, STATUS } from "../../../constants/database"
import { REQUEST_TARGET_USER, REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../../types/requestSymbols"
import SERVICES from "../../../services"
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../../errors"
import canGetUser from "./canGetUser"
import canUpdateUser from "./canUpdateUser"
import canDeleteUser from "./canDeleteUser"
import getTargetUser from "./getTargetUser"

/**
 * Check if the user has the required permission to access the resource
 * @param permission PERMISSIONS
 * @param matchId boolean - If true then the user id must match the resource id (can only edit self etc)
 */
const checkPermission = (permission: PERMISSIONS) => (req: Request, res: Response, next: NextFunction) => {
  const user = req[REQUEST_USER]

  if (!user) throw new BadRequestError("User data is missing.")
  if (!!user.deletedAt) throw new ForbiddenError("User was deleted.")
  if (!user.role) throw new ForbiddenError("User has no role.")

  if (ROLES.LOCKED === user.role) throw new ForbiddenError("User account is locked.")
  if (STATUS.BANNED === user.status) throw new ForbiddenError("User account is banned.")
  if (STATUS.DELETED === user.status) throw new ForbiddenError("User account was deleted.")
  if (STATUS.SUSPENDED === user.status) throw new ForbiddenError("User account is suspended.")
  if (STATUS.UNVERIFIED === user.status) throw new ForbiddenError("User account is not verified.")

  // Finally check the actual ACL
  if (user.role && !ACL[user.role].includes(permission)) throw new ForbiddenError("User cant perform this action.")

  next()
}

const RBAC = {
  getTargetUser,

  // More complex checks for multiple permission cases

  checkCanGetUser: canGetUser,
  checkCanUpdateUser: canUpdateUser,
  checkCanDeleteUser: canDeleteUser,

  // Simple checks 1:1 against permissions

  // User management
  checkCanCreateUsers: checkPermission(PERMISSIONS.CAN_CREATE_USERS),
  checkCanCreateSameRoleUsers: checkPermission(PERMISSIONS.CAN_CREATE_SAME_ROLE_USERS),
  checkCanCreateLowerRoleUsers: checkPermission(PERMISSIONS.CAN_CREATE_LOWER_ROLE_USERS),

  // User retrieval
  checkCanGetOwnUser: checkPermission(PERMISSIONS.CAN_GET_OWN_USER),
  checkCanGetAllUsers: checkPermission(PERMISSIONS.CAN_GET_ALL_USERS),
  checkCanGetSameRoleUsers: checkPermission(PERMISSIONS.CAN_GET_SAME_ROLE_USERS),
  checkCanGetLowerRoleUsers: checkPermission(PERMISSIONS.CAN_GET_LOWER_ROLE_USERS),

  // User updates
  checkCanUpdateAnyUserProfile: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_PROFILE),
  checkCanUpdateAnyUserRole: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_ROLE),
  checkCanUpdateAnyUserStatus: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS),
  checkCanUpdateOwnUser: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_USER),
  checkCanUpdateSameRoleUsers: checkPermission(PERMISSIONS.CAN_UPDATE_SAME_ROLE_USERS),
  checkCanUpdateLowerRoleUsers: checkPermission(PERMISSIONS.CAN_UPDATE_LOWER_ROLE_USERS),

  // User deletion
  checkCanDeleteAnyUser: checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER),
  checkCanDeleteSameRoleUsers: checkPermission(PERMISSIONS.CAN_DELETE_SAME_ROLE_USERS),
  checkCanDeleteLowerRoleUsers: checkPermission(PERMISSIONS.CAN_DELETE_LOWER_ROLE_USERS),

  // System operations
  checkCanClearExpiredTokens: checkPermission(PERMISSIONS.CAN_CLEAR_EXPIRED_TOKENS),
  checkCanViewAuditLogs: checkPermission(PERMISSIONS.CAN_VIEW_AUDIT_LOGS),
  checkCanManageRoles: checkPermission(PERMISSIONS.CAN_MANAGE_ROLES),

  // Minimal permissions
  checkCanAccessOwnData: checkPermission(PERMISSIONS.CAN_ACCESS_OWN_DATA),
}

export default RBAC
