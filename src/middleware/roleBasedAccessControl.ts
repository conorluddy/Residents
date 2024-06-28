import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { JWTUserPayload } from "../utils/generateJwt"
import { ACL, PERMISSIONS } from "../constants/accessControlList"
import db from "../db"
import { tableUsers } from "../db/schema"
import { eq } from "drizzle-orm"
import { ROLES_ARRAY } from "../constants/roles"
import { logger } from "../utils/logger"

export const RBAC = {
  checkCanGetSelf: checkPermission(PERMISSIONS.CAN_GET_OWN_USER, true),
  checkCanGetUsers: checkPermission(PERMISSIONS.CAN_GET_ALL_USERS),
  checkCanUpdateUsers: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER),
  checkCanDeleteUser: checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER),
  checkCanUpdateUserStatus: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS),
  checkCanUpdateOwnProfile: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_PROFILE),
  checkRoleSuperiority: checkRoleSuperiority(),

  checkCanCreateUsers: (req: Request, res: Response, next: NextFunction) => next(),
}

function checkPermission(permission: PERMISSIONS, matchId?: boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JWTUserPayload
    if (matchId && req.params.id !== user.id.toString()) {
      logger.warn(`User ${user.id} forbidden from accessing resource ${req.params.id}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Forbidden" })
    }
    if (user.role && !ACL[user.role].includes(permission)) {
      logger.warn(`User ${user.id} with role ${user.role} lacks permission ${permission}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Forbidden" })
    }
    next()
  }
}

function checkRoleSuperiority() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JWTUserPayload
    const targetUserId = req.params.id

    try {
      const targetUser = await db
        .select()
        .from(tableUsers)
        .where(eq(tableUsers.id, Number(targetUserId)))

      if (!targetUser[0]?.role) {
        logger.error(`Target user ${targetUserId} not found`)
        return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "User not found" })
      }

      const userRoleIndex = ROLES_ARRAY.findIndex((role) => role === user.role)
      const targetRoleIndex = ROLES_ARRAY.findIndex((role) => role === targetUser[0]?.role)

      if (userRoleIndex === -1 || targetRoleIndex === -1) {
        logger.error(`User roles not found for user ${user.id} or target ${targetUserId}`)
        return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "User roles not found" })
      }

      if (targetRoleIndex <= userRoleIndex) {
        logger.warn(`User ${user.id} lacks role superiority over target ${targetUserId}`)
        return res
          .status(HTTP_CLIENT_ERROR.FORBIDDEN)
          .json({ message: "Role superiority is required for this operation" })
      }

      next()
    } catch (error) {
      logger.error(`Error checking role superiority for user ${user.id} and target ${targetUserId}: ${error}`)
      res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" })
    }
  }
}
