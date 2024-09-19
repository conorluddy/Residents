import { Request, Response } from 'express'
import { STATUS, TOKEN_TYPE } from '../../constants/database'
import { BadRequestError, TokenError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TOKEN } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * validateAccount
 */
export const validateAccount = async (req: Request, res: Response): Promise<Response> => {
  const { tokenId, userId: userIdFromUrlParam } = req.params
  const token = req[REQUEST_TOKEN]

  if (!userIdFromUrlParam) {
    throw new BadRequestError(MESSAGES.INVALID_USER_DATA)
  } // probably redundant
  if (!token) {
    throw new TokenError('Validation token missing.')
  }
  if (token.type !== TOKEN_TYPE.VALIDATE || token.userId !== userIdFromUrlParam || tokenId !== token.id) {
    throw new TokenError('Validation token invalid.')
  }

  await Promise.all([
    SERVICES.updateUserStatus({ userId: userIdFromUrlParam, status: STATUS.VERIFIED }),
    SERVICES.deleteToken({ tokenId: token.id }),
  ])

  logger.info(`User ${userIdFromUrlParam} validated.`)

  return handleSuccessResponse({ res, message: MESSAGES.ACCOUNT_VALIDATED })
}
