import { NextFunction, Request, Response } from 'express'
import { ROLES, ROLES_ARRAY, STATUS } from '../../../constants/database'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../../errors'
import SERVICES from '../../../services'
import { REQUEST_TARGET_USER, REQUEST_TARGET_USER_ID, REQUEST_USER } from '../../../types/requestSymbols'

/**
 * Get the target user from the request params if the user has the required permissions
 * @param req
 * @param res
 * @param next
 */
async function getTargetUser(req: Request, _res: Response, next: NextFunction) {
  const user = req[REQUEST_USER]
  if (!user) {
    throw new BadRequestError('Missing User data.')
  }
  if (!user.role) {
    throw new ForbiddenError('User has no role.')
  }
  if (user.deletedAt) {
    throw new UnauthorizedError('User account is deleted.')
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
    throw new NotFoundError('Target user not found.')
  }
  if (!targetUser.role) {
    throw new ForbiddenError('Target user role not found.')
  }
  if (!ROLES_ARRAY.includes(targetUser.role)) {
    throw new ForbiddenError('Invalid target user role.')
  }

  // All good, set the target user on the request object

  req[REQUEST_TARGET_USER] = targetUser
  req[REQUEST_TARGET_USER_ID] = targetUser.id
  next()
}

export default getTargetUser
