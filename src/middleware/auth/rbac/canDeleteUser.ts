import { NextFunction, Request, Response } from "express"
import { ACL, PERMISSIONS } from "../../../constants/accessControlList"
import { ROLES_ARRAY } from "../../../constants/database"
import { BadRequestError, ForbiddenError } from "../../../errors"
import { REQUEST_TARGET_USER, REQUEST_USER } from "../../../types/requestSymbols"

/**
 * Check if the user has the required permission
 * @param req
 * @param res
 * @param next
 */
async function canDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = req[REQUEST_USER]
  const targetUser = req[REQUEST_TARGET_USER]

  if (!user || !targetUser || !user.role || !targetUser.role) {
    throw new BadRequestError("User data is missing.")
  }

  if (user.id === targetUser.id) {
    throw new ForbiddenError("Users can not self-delete.")
  }

  if (ACL[user.role].includes(PERMISSIONS.CAN_DELETE_ANY_USER)) {
    return next()
  }

  if (user.role === targetUser.role && ACL[user.role].includes(PERMISSIONS.CAN_DELETE_SAME_ROLE_USERS)) {
    return next()
  }

  // Turn this lookup into a map for better efficiency sometime
  const userRoleIndex = ROLES_ARRAY.indexOf(user.role)
  const targetRoleIndex = ROLES_ARRAY.indexOf(targetUser.role)

  if (userRoleIndex < targetRoleIndex && ACL[user.role].includes(PERMISSIONS.CAN_DELETE_LOWER_ROLE_USERS)) {
    return next()
  }

  throw new ForbiddenError("User doesn't have permission to delete this user.")
}

export default canDeleteUser