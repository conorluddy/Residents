import { NextFunction, Request, Response } from "express"
import { ACL, PERMISSIONS } from "../../constants/accessControlList"
import { ROLES, ROLES_ARRAY, STATUS } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import SERVICES from "../../services"
import { BadRequestError, ForbiddenError } from "../../errors"

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

  if (user.role && !ACL[user.role].includes(permission)) throw new ForbiddenError("User cant perform this action.")

  next()
}

/**
 * Check if the user has role superiority over the target user
 */
async function getTargetUserAndCheckSuperiority(req: Request, res: Response, next: NextFunction) {
  const user = req[REQUEST_USER]
  const targetUserId = req.params.id

  if (!user) {
    logger.warn(`User data is missing from the request`)
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Missing User data." })
  }

  if (!user.role) {
    logger.warn(`User ${user.id} is missing a role`)
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "User has no role" })
  }

  if (user.role === ROLES.LOCKED) {
    logger.warn(`User ${user.id} account is locked`)
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "User account is locked" })
  }

  // User has no role
  if (!!user.deletedAt) {
    logger.warn(`User ${user.id} account is deleted`)
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "User account is deleted" })
  }

  const targetUser = await SERVICES.getUserByID(targetUserId)

  // No user found
  if (!targetUser) {
    logger.error(`Target user ${targetUserId} not found`)
    return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Target user not found" })
  }

  // User has no role
  if (!targetUser.role) {
    logger.error(`Target user ${targetUserId} has no role`)
    return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Target user role not found" })
  }

  // Target user is locked and can only be edited by Admin or Owner. (Improve this later / make configurable)
  if (targetUser?.role === ROLES.LOCKED && ![ROLES.ADMIN, ROLES.OWNER].includes(user.role)) {
    logger.warn(`User ${targetUserId} is locked`)
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Target user account is locked" })
  }

  // Get the Role rankings
  const userRoleIndex = ROLES_ARRAY.findIndex((role) => role === user.role)
  const targetRoleIndex = ROLES_ARRAY.findIndex((role) => role === targetUser.role)

  // Fail early if no roles found
  if (userRoleIndex === -1 || targetRoleIndex === -1) {
    logger.error(`User roles not found for user ${user.id} or target ${targetUserId}`)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Roles not found." })
  }

  // Check if the user has role superiority based on the role index
  if (targetRoleIndex <= userRoleIndex) {
    logger.warn(`User ${user.id} lacks role superiority over target ${targetUserId}`)
    return res
      .status(HTTP_CLIENT_ERROR.UNAUTHORIZED)
      .json({ message: "Role superiority is required for this operation" })
  }

  req[REQUEST_TARGET_USER_ID] = targetUser.id
  next()
}

const RBAC = {
  checkCanGetOwnUser: checkPermission(PERMISSIONS.CAN_GET_OWN_USER),
  checkCanCreateUsers: checkPermission(PERMISSIONS.CAN_CREATE_USERS),
  checkCanGetUsers: checkPermission(PERMISSIONS.CAN_GET_ALL_USERS),
  checkCanUpdateUsers: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER),
  checkCanUpdateOwnUser: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_USER),
  checkCanDeleteUsers: checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER),
  checkCanUpdateAnyUserStatus: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS),
  checkCanUpdateOwnProfile: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_USER),
  //
  getTargetUserAndCheckSuperiority: getTargetUserAndCheckSuperiority,
}

export default RBAC
