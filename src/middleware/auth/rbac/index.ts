import { NextFunction, Request, Response } from 'express'
import { ACL, PERMISSIONS } from '../../../constants/accessControlList'
import { ROLES, STATUS } from '../../../constants/database'
import { BadRequestError, ForbiddenError } from '../../../errors'
import { REQUEST_USER } from '../../../types/requestSymbols'
import canDeleteUser from './canDeleteUser'
import canGetUser from './canGetUser'
import canUpdateUser from './canUpdateUser'
import getTargetUser from './getTargetUser'

/**
 * Check if the user has the required permission to access the resource
 * @param permission PERMISSIONS
 * @param matchId boolean - If true then the user id must match the resource id (can only edit self etc)
 */
const checkPermission = (permission: PERMISSIONS) => (req: Request, res: Response, next: NextFunction) => {
  const user = req[REQUEST_USER]

  if (!user) {
    throw new BadRequestError(MESSAGES.MISSING_USER_DATA)
  }
  if (user.deletedAt) {
    throw new ForbiddenError(MESSAGES.USER_DELETED)
  }
  if (!user.role) {
    throw new ForbiddenError('User has no role.')
  }

  if (ROLES.LOCKED === user.role) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_LOCKED)
  }
  if (STATUS.BANNED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_BANNED)
  }
  if (STATUS.DELETED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_DELETED)
  }
  if (STATUS.SUSPENDED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_SUSPENDED)
  }
  if (STATUS.UNVERIFIED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_NOT_VERIFIED)
  }

  // Finally check the actual ACL
  if (user.role && !ACL[user.role].includes(permission)) {
    throw new ForbiddenError('User cant perform this action.')
  }

  next()
}

const RBAC = {
  getTargetUser,

  /**
   * Simple checks 1:1 against permissions
   */

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

  /**
   * More complex checks for multiple permission cases
   */

  checkCanGetUser: canGetUser,
  checkCanUpdateUser: canUpdateUser,
  checkCanDeleteUser: canDeleteUser,
}

export default RBAC

export { getTargetUser }
