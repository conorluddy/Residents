import { Request, Response } from 'express'
import { BadRequestError, NotFoundError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * getUser
 * @param req[REQUEST_TARGET_USER_ID] - The ID of the user to get, provided by upstream middleware
 */
export const getUser = async (req: Request, res: Response): Promise<Response> => {
  //
  const userId = req[REQUEST_TARGET_USER_ID]
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  //
  const user = await SERVICES.getUserById(userId)
  if (!user) {
    throw new NotFoundError(MESSAGES.USER_NOT_FOUND)
  }
  //
  return handleSuccessResponse({ res, user })
}

export default getUser
