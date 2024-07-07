import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { JWTUserPayload } from "../utils/generateJwt"
import { ACL, PERMISSIONS } from "../constants/accessControlList"
import { tableUsers, User } from "../db/schema"
import { eq } from "drizzle-orm"
import { logger } from "../utils/logger"
import { ROLES, ROLES_ARRAY } from "../constants/database"
import db from "../db"

export const RBAC = {
  canGetOwnUser: checkPermission(PERMISSIONS.CAN_GET_OWN_USER),
  checkCanCreateUsers: checkPermission(PERMISSIONS.CAN_CREATE_USERS),
  checkCanGetUsers: checkPermission(PERMISSIONS.CAN_GET_ALL_USERS),
  checkCanUpdateUsers: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER),
  checkCanUpdateOwnUser: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_USER),
  checkCanDeleteUser: checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER),
  checkCanUpdateAnyUserStatus: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS),
  checkCanUpdateOwnProfile: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_USER),
  checkRoleSuperiority,
}

/**
 * Check if the user has the required permission to access the resource
 * @param permission PERMISSIONS
 * @param matchId boolean - If true then the user id must match the resource id (can only edit self etc)
 */
function checkPermission(permission: PERMISSIONS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JWTUserPayload

    if (user.deletedAt !== null) {
      logger.warn(`User ${user.id} lacks permission ${permission} because they are deleted`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Forbidden" })
    }

    if (user.role && !ACL[user.role].includes(permission)) {
      logger.warn(`User ${user.id} with role ${user.role} lacks permission ${permission}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Forbidden" })
    }

    next()
  }
}

/**
 * Check if the user has role superiority over the target user
 */
async function checkRoleSuperiority(req: Request, res: Response, next: NextFunction) {
  const user = req.user as JWTUserPayload
  const targetUserId = req.params.id

  try {
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

    const targetUsers: User[] = await db.select().from(tableUsers).where(eq(tableUsers.id, targetUserId))
    const targetUser = targetUsers[0]

    // No user found
    if (!targetUser) {
      logger.error(`Target user ${targetUserId} not found`)
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Target user not found" })
    }

    // User has no role
    if (!targetUser.role) {
      logger.error(`Target user ${targetUserId} has no role`)
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Target user not found" })
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
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Roles not found" })
    }

    // Check if the user has role superiority based on the role index
    if (targetRoleIndex <= userRoleIndex) {
      logger.warn(`User ${user.id} lacks role superiority over target ${targetUserId}`)
      return res
        .status(HTTP_CLIENT_ERROR.UNAUTHORIZED)
        .json({ message: "Role superiority is required for this operation" })
    }

    req.targetUserId = targetUser.id
    next()
  } catch (error) {
    logger.error(`Error checking role superiority for user ${user.id} and target ${targetUserId}: ${error}`)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" })
  }
}
