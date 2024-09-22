import { Request, Response } from 'express'
import SERVICES from '../../services'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import { DEFAULT_PAGE_SIZE_ROW_LIMIT } from '../../services/user/getAllUsers'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'

/**
 * getAllUsers
 */
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  const limit = parseInt(req.params?.limit ?? DEFAULT_PAGE_SIZE_ROW_LIMIT)
  const offset = parseInt(req.params?.offset ?? 0)

  if ((limit && isNaN(limit)) || (offset && isNaN(offset))) {
    throw new BadRequestError(MESSAGES.INVALID_PAGINATION_PARAMS)
  }

  // TODO: Add a WITHMETA flag to include the user meta data
  // TODO: Filtering / searching / pagination
  const users = await SERVICES.getAllUsers({ offset, limit })
  return handleSuccessResponse({ res, users })
}

export default getAllUsers
