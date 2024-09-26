import { Response } from 'express'
import { Meta, MetaUpdate } from '../../db/types'
import { BadRequestError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * updateUserMeta
 */
export const updateUserMeta = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<Response> => {
  const { id } = req.params
  const { body }: Record<'body', MetaUpdate> = req
  const targetUserId = req[REQUEST_TARGET_USER_ID]

  if (!id || !targetUserId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (id !== targetUserId) {
    throw new BadRequestError(MESSAGES.USER_ID_MISMATCH)
  }

  // TODO: Use a request symbol for this
  if (!body || Object.keys(body).length === 0) {
    throw new BadRequestError(MESSAGES.NO_UPDATE_DATA)
  }

  // Add the rest of the user meta fields.
  // Sanitise and validate the data (ideally in a middleware before we ever get to this controller)
  const { metaItem }: Partial<Meta> = body ?? {}

  await SERVICES.updateUserMeta({ userId: id, metaItem })

  return handleSuccessResponse({ res, message: MESSAGES.USER_META_UPDATED })
}
