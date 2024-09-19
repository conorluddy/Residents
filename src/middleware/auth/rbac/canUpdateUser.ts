import { NextFunction, Request, Response } from 'express'
import { ACL, PERMISSIONS } from '../../../constants/accessControlList'
import { ROLES_ARRAY } from '../../../constants/database'
import { BadRequestError, ForbiddenError } from '../../../errors'
import { REQUEST_TARGET_USER, REQUEST_USER } from '../../../types/requestSymbols'
import MESSAGES from '../../../constants/messages'

/**
 * Check if the user has the required permission
 * @param req
 * @param res
 * @param next
 */
function canUpdateUser(req: Request, res: Response, next: NextFunction): void {
  const user = req[REQUEST_USER]
  const targetUser = req[REQUEST_TARGET_USER]

  if (!user || !targetUser || !user.role || !targetUser.role) {
    throw new BadRequestError(MESSAGES.MISSING_USER_DATA)
  }

  if (user.id === targetUser.id && ACL[user.role].includes(PERMISSIONS.CAN_UPDATE_OWN_USER)) {
    return next()
  }

  if (ACL[user.role].includes(PERMISSIONS.CAN_UPDATE_ANY_USER_PROFILE)) {
    return next()
  }

  if (user.role === targetUser.role && ACL[user.role].includes(PERMISSIONS.CAN_UPDATE_SAME_ROLE_USERS)) {
    return next()
  }

  // Turn this lookup into a map for better efficiency sometime
  const userRoleIndex = ROLES_ARRAY.indexOf(user.role)
  const targetRoleIndex = ROLES_ARRAY.indexOf(targetUser.role)

  if (userRoleIndex < targetRoleIndex && ACL[user.role].includes(PERMISSIONS.CAN_UPDATE_LOWER_ROLE_USERS)) {
    return next()
  }

  throw new ForbiddenError('User does not have permission to update this user.')
}

export default canUpdateUser
