import { Response } from 'express'
import { isStrongPassword } from 'validator'
import { TOKEN_TYPE } from '../../constants/database'
import { PASSWORD_STRENGTH_CONFIG } from '../../constants/password'
import { DatabaseError, PasswordStrengthError, TokenError } from '../../errors'
import SERVICES from '../../services'
import { REQUEST_TOKEN } from '../../types/requestSymbols'
import { createHash } from '../../utils/crypt'
import { logger } from '../../utils/logger'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * resetPasswordWithToken
 * POST
 */
export const resetPasswordWithToken = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<void> => {
  const {
    body: { password: plainPassword },
  }: Record<'body', Record<'password', string>> = req
  const token = req[REQUEST_TOKEN]

  // Alternatively here we can generate a temporary PW and email it to the user,
  // and make that configurable for the app. Probably overlaps with magic login.

  // MW should guarantee we have this
  if (!token || !token.userId) {
    throw new TokenError(MESSAGES.TOKEN_MISSING)
  }

  if (token.type !== TOKEN_TYPE.RESET) {
    throw new TokenError(MESSAGES.INVALID_TOKEN_TYPE)
  }

  if (!plainPassword) {
    throw new PasswordStrengthError(MESSAGES.PASSWORD_REQUIRED)
  }

  // Centralise configuration for this somewhere - can use it for registration too
  if (!isStrongPassword(plainPassword, PASSWORD_STRENGTH_CONFIG)) {
    throw new PasswordStrengthError(MESSAGES.WEAK_PASSWORD)
  }

  const password = await createHash(plainPassword)

  const [updatedUserId] = await Promise.all([
    SERVICES.updateUserPassword({ userId: token.userId, password }),
    SERVICES.deleteToken({ tokenId: token.id }),
  ])

  // This case should never happen but will leave it here for now
  if (updatedUserId !== token.userId) {
    throw new DatabaseError(`${MESSAGES.PASSWORD_UPDATE_ERROR} UID:${token.userId}`)
  }

  logger.info(`${MESSAGES.PASSWORD_WAS_RESET} UID:${token.userId}`)

  handleSuccessResponse({ res, message: MESSAGES.PASSWORD_RESET_SUCCESS })
}
