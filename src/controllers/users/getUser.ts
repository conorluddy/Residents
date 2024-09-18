import { NextFunction, Request, Response } from 'express'
import { BadRequestError, NotFoundError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * getUser
 * @param req[REQUEST_TARGET_USER_ID] - The ID of the user to get, provided by upstream middleware
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  //
  const userId = req[REQUEST_TARGET_USER_ID]
  if (!userId) {throw new BadRequestError('User ID is missing.')}
  //
  const user = await SERVICES.getUserById(userId)
  if (!user) {throw new NotFoundError('User not found.')}
  //
  return handleSuccessResponse({ res, user })
}

export default getUser
