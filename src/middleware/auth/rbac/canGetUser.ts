import { NextFunction, Request, Response } from "express"
import { ACL, PERMISSIONS } from "../../../constants/accessControlList"
import { ROLES_ARRAY } from "../../../constants/database"
import { BadRequestError, ForbiddenError } from "../../../errors"
import { REQUEST_TARGET_USER, REQUEST_USER } from "../../../types/requestSymbols"

/**
 * Check if the user has the required permission to get the target user
 * @param req
 * @param res
 * @param next
 */
async function canGetUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = req[REQUEST_USER]
  const targetUser = req[REQUEST_TARGET_USER]

  if (!user?.role) {
    throw new BadRequestError("User data is missing.")
  }

  if (!targetUser?.role) {
    throw new BadRequestError("Target user data is missing.")
  }

  if (user.id === targetUser.id && ACL[user.role].includes(PERMISSIONS.CAN_GET_OWN_USER)) {
    return next()
  }
  // OPTIMISE: Dedupe these - they do the same stuff
  if (user.id === targetUser.id && ACL[user.role].includes(PERMISSIONS.CAN_ACCESS_OWN_DATA)) {
    return next()
  }

  if (ACL[user.role].includes(PERMISSIONS.CAN_GET_ALL_USERS)) {
    return next()
  }

  if (user.role === targetUser.role && ACL[user.role].includes(PERMISSIONS.CAN_GET_SAME_ROLE_USERS)) {
    return next()
  }

  // Turn this lookup into a map for better efficiency sometime
  const userRoleIndex = ROLES_ARRAY.indexOf(user.role)
  const targetRoleIndex = ROLES_ARRAY.indexOf(targetUser.role)

  if (userRoleIndex < targetRoleIndex && ACL[user.role].includes(PERMISSIONS.CAN_GET_LOWER_ROLE_USERS)) {
    return next()
  }

  throw new ForbiddenError("User doesn't have permission to get this user.")
}

export default canGetUser
