import { NextFunction, Response } from 'express'
import { ACL, PERMISSIONS } from '../../../constants/accessControlList'
import { ROLES_ARRAY } from '../../../constants/database'
import { BadRequestError, ForbiddenError } from '../../../errors'
import { REQUEST_TARGET_USER, REQUEST_USER } from '../../../types/requestSymbols'
import MESSAGES from '../../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../../types'

/**
 * Check if the user has the required permission to get the target user
 * @param req
 * @param res
 * @param next
 */
function canGetUser(req: ResidentRequest, res: Response<ResidentResponse>, next: NextFunction): void {
  const user = req[REQUEST_USER]
  const targetUser = req[REQUEST_TARGET_USER]

  if (!user?.role) {
    throw new BadRequestError(MESSAGES.MISSING_USER_DATA)
  }

  if (!targetUser?.role) {
    throw new BadRequestError(MESSAGES.TARGET_USER_DATA_MISSING)
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

  throw new ForbiddenError(MESSAGES.USER_GET_PERMISSION_DENIED)
}

export default canGetUser
