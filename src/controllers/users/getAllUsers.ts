import SERVICES from '../../services'
import { Request, Response } from 'express'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import { DEFAULT_PAGE_SIZE_ROW_LIMIT } from '../../services/user/getAllUsers'
import { getQueryNumber, getStringFromQuery } from '../../utils/queryStrings'
import { ROLES, ROLES_ARRAY, STATUS, STATUS_ARRAY } from '../../constants/database'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'

/**
 * getAllUsers
 */
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  // Pagination
  const limit = getQueryNumber(req.query?.limit, DEFAULT_PAGE_SIZE_ROW_LIMIT)
  const offset = getQueryNumber(req.query?.offset, 0)

  // Search
  const firstName = getStringFromQuery(req.query?.firstName)
  const lastName = getStringFromQuery(req.query?.lastName)
  const email = getStringFromQuery(req.query?.email)
  const username = getStringFromQuery(req.query?.username)

  // Filters
  const role = getStringFromQuery(req.query?.role)
  const status = getStringFromQuery(req.query?.status)

  // Validate the role and status, TODO: could be moved to a middleware validator for this route
  if (role && !ROLES_ARRAY.includes(role as ROLES)) {
    throw new BadRequestError(MESSAGES.INVALID_ROLE)
  }
  if (status && !STATUS_ARRAY.includes(status as STATUS)) {
    throw new BadRequestError(MESSAGES.INVALID_ROLE)
  }
  const verifiedRole = role as ROLES | undefined
  const verifiedStatus = status as STATUS | undefined

  // TODO: Add a WITHMETA flag to include the user meta data

  const users = await SERVICES.getAllUsers({
    offset,
    limit,
    firstName,
    lastName,
    email,
    username,
    role: verifiedRole,
    status: verifiedStatus,
  })

  return handleSuccessResponse({ res, users })
}

export default getAllUsers
