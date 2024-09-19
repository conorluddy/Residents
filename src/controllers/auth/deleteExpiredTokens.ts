import { Request, Response } from 'express'
import SERVICES from '../../services'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * deleteExpiredTokens
 * Utility to probably to be run on a cron job or similar
 */
export const deleteExpiredTokens = async (req: Request, res: Response): Promise<Response> => {
  const count = await SERVICES.deleteExpiredTokens()
  return handleSuccessResponse({ res, message: `${count} expired tokens deleted.` })
}
