import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR } from "../constants/http"
import { JWTUserPayload } from "../utils/generateJwt"
import { ACL, PERMISSIONS } from "../constants/acl"

const checkPermission = (permission: PERMISSIONS) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user as JWTUserPayload
    if (role && ACL[role].includes(permission)) {
      return next()
    }
    return res
      .status(HTTP_CLIENT_ERROR.FORBIDDEN)
      .json({ message: "Forbidden" })
  }
}

export const canGetAllUsers = checkPermission(PERMISSIONS.CAN_GET_ALL_USERS)
export const canUpdateAnyUser = checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER)
export const canDeleteAnyUser = checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER)
export const canUpdateAnyUserStatus = checkPermission(
  PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS
)
export const canUpdateOwnProfile = checkPermission(
  PERMISSIONS.CAN_UPDATE_OWN_PROFILE
)
