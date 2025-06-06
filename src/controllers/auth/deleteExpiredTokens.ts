import { Response } from 'express'
import SERVICES from '../../services'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * deleteExpiredTokens
 * Utility to probably to be run on a cron job or similar
 */
export const deleteExpiredTokens = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<void> => {
  const count = await SERVICES.deleteExpiredTokens()
  handleSuccessResponse({ res, message: `${count} ${MESSAGES.EXPIRED_TOKENS_DELETED}` })
}
