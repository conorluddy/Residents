import { Response } from 'express'
import { ROLES, STATUS } from '../../constants/database'
import MESSAGES from '../../constants/messages'
import { BadRequestError } from '../../errors'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import SERVICES from '../../services'
import { DEFAULT_PAGE_SIZE_ROW_LIMIT } from '../../services/user/getAllUsers'
import { ResidentRequest, ResidentResponse } from '../../types'
import { getQueryNumber, getStringFromQuery } from '../../utils/queryStrings'
import TYPEGUARD from '../../types/typeguards'

/**
 * getAllUsers
 */
export const getAllUsers = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<void> => {
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

  // const role = roleString ? TYPEGUARD.isValidRole(roleString)

  // Validate the role and status, TODO: could be moved to a middleware validator for this route
  if (role && !TYPEGUARD.isValidRole(role)) {
    throw new BadRequestError(MESSAGES.INVALID_ROLE)
  }
  const verifiedRole: ROLES | undefined = role && TYPEGUARD.isValidRole(role) ? role : undefined

  if (status && !TYPEGUARD.isValidStatus(status)) {
    throw new BadRequestError(MESSAGES.INVALID_STATUS)
  }
  const verifiedStatus: STATUS | undefined = status && TYPEGUARD.isValidStatus(status) ? status : undefined

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

  handleSuccessResponse({ res, users })
}

export default getAllUsers
