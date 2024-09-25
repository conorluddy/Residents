import { Response } from 'express'
import { UserUpdate } from '../../db/types'
import { BadRequestError, ForbiddenError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

/**
 * updateUser
 */
export const updateUser = async (req: ResidentRequest, res: Response): Promise<Response> => {
  const { id } = req.params
  const targetUserId = req[REQUEST_TARGET_USER_ID]
  //
  if (!id || !targetUserId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }

  // Possibly redundant, as the RBAC middleware will have found the user
  // and only set the [REQUEST_TARGET_USER_ID] on the request if it is valid
  if (id !== targetUserId) {
    throw new ForbiddenError(MESSAGES.USER_ID_MISMATCH)
  }

  // TODO: This is a check that should be done way before even looking up the target user
  // TODO: Needs to be done in a payload validation middleware
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new BadRequestError(MESSAGES.NO_UPDATE_DATA)
  }
  // TODO: Once the validation middlewares run they should put the payload into a request suymbol
  const { username, firstName, lastName, email, password }: Partial<UserUpdate> = req.body ?? {}

  // Add user meta fields here too so they be updated in parallel from a single payload?
  const updatedUserId = await SERVICES.updateUser({ userId: id, username, firstName, lastName, email, password })

  return handleSuccessResponse({ res, message: `User ${updatedUserId} updated successfully` })
}
