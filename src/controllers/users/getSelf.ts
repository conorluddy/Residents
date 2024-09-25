import { Response } from 'express'
import { REQUEST_USER } from '../../types/requestSymbols'
import SERVICES from '../../services'
import { BadRequestError, NotFoundError } from '../../errors'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

/**
 * getSelf - gets own user record
 */
export const getSelf = async (req: ResidentRequest, res: Response): Promise<Response> => {
  //
  const userId = req[REQUEST_USER]?.id
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

export default getSelf
