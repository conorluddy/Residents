import { Response } from 'express'
import { Meta } from '../../db/types'
import { BadRequestError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

/**
 * updateUserMeta
 */
export const updateUserMeta = async (req: ResidentRequest, res: Response): Promise<Response> => {
  const { id } = req.params
  const targetUserId = req[REQUEST_TARGET_USER_ID]

  if (!id || !targetUserId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (id !== targetUserId) {
    throw new BadRequestError(MESSAGES.USER_ID_MISMATCH)
  }

  // TODO: Use a request symbol for this
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new BadRequestError(MESSAGES.NO_UPDATE_DATA)
  }

  // Add the rest of the user meta fields.
  // Sanitise and validate the data (ideally in a middleware before we ever get to this controller)
  const { metaItem }: Partial<Meta> = req.body ?? {}

  await SERVICES.updateUserMeta({ userId: id, metaItem })

  return handleSuccessResponse({ res, message: MESSAGES.USER_META_UPDATED })
}
