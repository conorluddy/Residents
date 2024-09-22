import SERVICES from '../../services'
import { Request, Response } from 'express'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import { DEFAULT_PAGE_SIZE_ROW_LIMIT } from '../../services/user/getAllUsers'
import { getQueryNumber } from '../../utils/queryStrings'

/**
 * getAllUsers
 */
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  const limit = getQueryNumber(req.query?.limit, DEFAULT_PAGE_SIZE_ROW_LIMIT)
  const offset = getQueryNumber(req.query?.offset, 0)

  // TODO: Add a WITHMETA flag to include the user meta data
  // TODO: Filtering / searching / pagination
  const users = await SERVICES.getAllUsers({ offset, limit })

  return handleSuccessResponse({ res, users })
}

export default getAllUsers
