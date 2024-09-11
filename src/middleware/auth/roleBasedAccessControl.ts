import { NextFunction, Request, Response } from "express"
import { ACL, PERMISSIONS } from "../../constants/accessControlList"
import { ROLES, ROLES_ARRAY, STATUS } from "../../constants/database"
import { REQUEST_TARGET_USER, REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../types/requestSymbols"
import SERVICES from "../../services"
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../errors"

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

/**
 * Get the target user from the request params if the user has the required permissions
 */
async function getTargetUser(req: Request, res: Response, next: NextFunction) {
  const user = req[REQUEST_USER]
  const targetUserId = req.params.id

  if (!user) throw new BadRequestError("Missing User data.")
  if (!!user.deletedAt) throw new UnauthorizedError("User account is deleted.")
  if (!user.role) throw new ForbiddenError("User has no role.")
  if (!ROLES_ARRAY.includes(user.role)) throw new ForbiddenError("Invalid user role.")
  if (user.role === ROLES.LOCKED) throw new ForbiddenError("User account is locked.")
  if (STATUS.BANNED === user.status) throw new ForbiddenError("User account is banned.")
  if (STATUS.SUSPENDED === user.status) throw new ForbiddenError("User account is suspended.")
  if (STATUS.UNVERIFIED === user.status) throw new ForbiddenError("User account is not verified.")
  if (STATUS.REJECTED === user.status) throw new ForbiddenError("User account is rejected.") // Not sure we need/use this

  // Go fetch the target user

  const targetUser = await SERVICES.getUserById(targetUserId)

  //

  if (!targetUser) throw new NotFoundError("Target user not found.")
  if (!targetUser.role) throw new ForbiddenError("Target user role not found.")
  if (!ROLES_ARRAY.includes(targetUser.role)) throw new ForbiddenError("Invalid target user role.")

  // All good, set the target user on the request object //

  req[REQUEST_TARGET_USER] = targetUser
  req[REQUEST_TARGET_USER_ID] = targetUser.id
  next()
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
async function checkCanGetUser(req: Request, res: Response, next: NextFunction) {
  const user = req[REQUEST_USER]
  const targetUser = req[REQUEST_TARGET_USER]

  if (!user || !targetUser || !user.role || !targetUser.role) {
    throw new BadRequestError("User data is missing.")
  }

  if (user.id === targetUser.id && ACL[user.role].includes(PERMISSIONS.CAN_GET_OWN_USER)) {
    return next()
  }

  if (ACL[user.role].includes(PERMISSIONS.CAN_GET_ALL_USERS)) {
    return next()
  }

  if (user.role === targetUser.role && ACL[user.role].includes(PERMISSIONS.CAN_GET_SAME_ROLE_USERS)) {
    return next()
  }

  const userRoleIndex = ROLES_ARRAY.indexOf(user.role)
  const targetRoleIndex = ROLES_ARRAY.indexOf(targetUser.role)

  if (userRoleIndex < targetRoleIndex && ACL[user.role].includes(PERMISSIONS.CAN_GET_LOWER_ROLE_USERS)) {
    return next()
  }

  throw new ForbiddenError("User doesn't have permission to get this user.")
}

const RBAC = {
  getTargetUser,
  checkCanGetUser,

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
