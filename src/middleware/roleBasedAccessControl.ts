import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { JWTUserPayload } from "../utils/generateJwt"
import { ACL, PERMISSIONS } from "../constants/accessControlList"
import db from "../db"
import { tableUsers } from "../db/schema"
import { eq } from "drizzle-orm"

import { logger } from "../utils/logger"
import { ROLES, ROLES_ARRAY } from "../constants/database"

export const RBAC = {
  checkCanGetUsers: checkPermission(PERMISSIONS.CAN_GET_ALL_USERS),
  checkCanUpdateUsers: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER),
  checkCanDeleteUser: checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER),
  checkCanUpdateUserStatus: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS),
  checkCanUpdateOwnProfile: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_PROFILE),
  checkRoleSuperiority: checkRoleSuperiority(),

  checkCanCreateUsers: (req: Request, res: Response, next: NextFunction) => next(),
}

/**
 * Check if the user has the required permission to access the resource
 * @param permission PERMISSIONS
 * @param matchId boolean - If true then the user id must match the resource id (can only edit self etc)
 */
function checkPermission(permission: PERMISSIONS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JWTUserPayload
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
function checkRoleSuperiority() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JWTUserPayload
    const targetUserId = req.params.id

    try {
      if (!user.role) {
        logger.warn(`User ${user.id} is missing a role`)
        return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "User has no role" })
      }

      const targetUser = await db.select().from(tableUsers).where(eq(tableUsers.id, targetUserId))

      // No user found
      if (!targetUser[0]?.role) {
        logger.error(`Target user ${targetUserId} not found`)
        return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Target not found" })
      }

      // Target user is locked and can only be edited by Admin or Owner. (Improve this later / make configurable)
      if (targetUser[0]?.role === ROLES.LOCKED && ![ROLES.ADMIN, ROLES.OWNER].includes(user.role)) {
        logger.warn(`User ${targetUserId} is locked`)
        return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Target is locked" })
      }

      // Get the Role rankings
      const userRoleIndex = ROLES_ARRAY.findIndex((role) => role === user.role)
      const targetRoleIndex = ROLES_ARRAY.findIndex((role) => role === targetUser[0]?.role)

      // Fail early if no roles found
      if (userRoleIndex === -1 || targetRoleIndex === -1) {
        logger.error(`User roles not found for user ${user.id} or target ${targetUserId}`)
        return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Roles not found" })
      }

      // Check if the user has role superiority based on the role index
      if (targetRoleIndex <= userRoleIndex) {
        logger.warn(`User ${user.id} lacks role superiority over target ${targetUserId}`)
        return res
          .status(HTTP_CLIENT_ERROR.FORBIDDEN)
          .json({ message: "Role superiority is required for this operation" })
      }

      req.targetUserId = targetUser[0].id
      next()
    } catch (error) {
      logger.error(`Error checking role superiority for user ${user.id} and target ${targetUserId}: ${error}`)
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" })
    }
  }
}
