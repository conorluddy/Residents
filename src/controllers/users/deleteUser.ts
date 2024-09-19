import { Request, Response } from 'express'
import { BadRequestError, ForbiddenError } from '../../errors'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import SERVICES from '../../services'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'

/**
 * deleteUser
 */
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  // The param ID is the ID of the user to be deleted from the URL
  const { id } = req.params
  // The targetUserId is the same ID of the user to be deleted, but will
  // only exist on the request if it has been validated by the middleware
  // getTargetUser fn
  const targetUserId = req[REQUEST_TARGET_USER_ID]

  if (!id || !targetUserId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (id !== targetUserId) {
    throw new ForbiddenError(MESSAGES.USER_ID_MISMATCH)
  }

  const deletedUserId = await SERVICES.deleteUser({ userId: id })

  return handleSuccessResponse({ res, message: `User ${deletedUserId} deleted` })
}
