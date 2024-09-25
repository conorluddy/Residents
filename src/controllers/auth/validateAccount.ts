import { Response } from 'express'
import { STATUS, TOKEN_TYPE } from '../../constants/database'
import { BadRequestError, TokenError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TOKEN } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

/**
 * validateAccount
 */
export const validateAccount = async (req: ResidentRequest, res: Response): Promise<Response> => {
  const { tokenId, userId: userIdFromUrlParam } = req.params
  const token = req[REQUEST_TOKEN]

  if (!userIdFromUrlParam) {
    throw new BadRequestError(MESSAGES.INVALID_USER_DATA)
  } // probably redundant
  if (!token) {
    throw new TokenError(MESSAGES.TOKEN_MISSING)
  }
  if (token.type !== TOKEN_TYPE.VALIDATE || token.userId !== userIdFromUrlParam || tokenId !== token.id) {
    throw new TokenError(MESSAGES.VALIDATION_TOKEN_INVALID)
  }

  await Promise.all([
    SERVICES.updateUserStatus({ userId: userIdFromUrlParam, status: STATUS.VERIFIED }),
    SERVICES.deleteToken({ tokenId: token.id }),
  ])

  logger.info(`${MESSAGES.USER_VALIDATED} ${userIdFromUrlParam}`)

  return handleSuccessResponse({ res, message: MESSAGES.ACCOUNT_VALIDATED })
}
