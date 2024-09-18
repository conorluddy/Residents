import { NextFunction, Request, Response } from 'express'
import { BadRequestError, ForbiddenError } from '../../errors'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import SERVICES from '../../services'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * deleteUser
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  // The param ID is the ID of the user to be deleted from the URL
  const { id } = req.params
  // The targetUserId is the same ID of the user to be deleted, but will
  // only exist on the request if it has been validated by the middleware
  // getTargetUser fn
  const targetUserId = req[REQUEST_TARGET_USER_ID]

  if (!id || !targetUserId) {throw new BadRequestError('User ID is missing.')}
  if (id !== targetUserId) {throw new ForbiddenError('User ID mismatch.')}

  const deletedUserId = await SERVICES.deleteUser({ userId: id })

  return handleSuccessResponse({ res, message: `User ${deletedUserId} deleted` })
}
