import { NextFunction, Response } from 'express'

import { ROLES, ROLES_ARRAY, STATUS } from '../../../constants/database'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../../errors'
import SERVICES from '../../../services'
import { REQUEST_TARGET_USER, REQUEST_TARGET_USER_ID, REQUEST_USER } from '../../../types/requestSymbols'
import MESSAGES from '../../../constants/messages'
import { ResidentRequest } from '../../../types'

/**
 * Get the target user from the request params if the user has the required permissions
 * @param req
 * @param res
 * @param next
 */
async function getTargetUser(req: ResidentRequest, _res: Response, next: NextFunction): Promise<void> {
  const user = req[REQUEST_USER]
  if (!user) {
    throw new BadRequestError(MESSAGES.MISSING_USER_DATA)
  }
  if (!user.role) {
    throw new ForbiddenError(MESSAGES.USER_HAS_NO_ROLE)
  }
  if (user.deletedAt) {
    throw new UnauthorizedError(MESSAGES.ACCOUNT_DELETED)
  }

  const isSelfLookup = req.url === '/self'
  const targetUserId = isSelfLookup ? user.id : req.params.id

  // OPTIMISATION: Make a map for these to make it more efficient sometime
  if (!ROLES_ARRAY.includes(user.role)) {
    throw new ForbiddenError(MESSAGES.INVALID_ROLE)
  }
  if (ROLES.LOCKED === user.role) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_LOCKED)
  }
  if (STATUS.BANNED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_BANNED)
  }
  if (STATUS.SUSPENDED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_SUSPENDED)
  }
  if (STATUS.UNVERIFIED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_NOT_VERIFIED)
  }
  if (STATUS.REJECTED === user.status) {
    throw new ForbiddenError(MESSAGES.ACCOUNT_REJECTED)
  } // Not sure we need/use this

  // Go fetch the target user
  const targetUser = await SERVICES.getUserById(targetUserId)

  if (!targetUser) {
    throw new NotFoundError(MESSAGES.USER_NOT_FOUND)
  }
  if (!targetUser.role) {
    throw new ForbiddenError(MESSAGES.INVALID_TARGET_USER_ROLE)
  }
  if (!ROLES_ARRAY.includes(targetUser.role)) {
    throw new ForbiddenError(MESSAGES.INVALID_TARGET_USER_ROLE)
  }

  // All good, set the target user on the request object

  req[REQUEST_TARGET_USER] = targetUser
  req[REQUEST_TARGET_USER_ID] = targetUser.id
  next()
}

export default getTargetUser
