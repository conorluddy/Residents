import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR } from "../constants/http"
import { JWTUserPayload } from "../utils/generateJwt"
import { ACL, PERMISSIONS } from "../constants/accessControlList"

/**
 * General permission check to see if this user's role allows them to do the thing.
 * If matchId is true, then the user must be the owner of the target resource.
 * @param permission PERMISSIONS
 * @param matchId boolean
 */
const checkPermission =
  (permission: PERMISSIONS, matchId?: boolean) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JWTUserPayload
    if (matchId && req.params.id !== user.id.toString()) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Forbidden" })
    }
    if (user.role && !ACL[user.role].includes(permission)) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Forbidden" })
    }
    return next()
  }

/**
 * Role Based Access Control
 */
export const RBAC = {
  checkCanGetSelf: checkPermission(PERMISSIONS.CAN_GET_OWN_USER, true),
  checkCanGetUsers: checkPermission(PERMISSIONS.CAN_GET_ALL_USERS),
  checkCanUpdateUsers: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER),
  checkCanDeleteUser: checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER),
  checkCanUpdateUserStatus: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS),
  checkCanUpdateOwnProfile: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_PROFILE),

  // TODO: Set this as a flag in .env and allow for a whitelist of emails. Allow all for now
  checkCanCreateUsers: (req: Request, res: Response, next: NextFunction) => next(),
}
