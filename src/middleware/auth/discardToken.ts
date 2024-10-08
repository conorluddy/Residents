import { NextFunction, RequestHandler, Response } from 'express'
import { REQUEST_TOKEN } from '../../types/requestSymbols'
import SERVICES from '../../services'
import { ForbiddenError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * Middleware for discarding a token after it has been used.
 */
const discardToken: RequestHandler = async (
  req: ResidentRequest,
  _res: Response<ResidentResponse>,
  next: NextFunction
) => {
  const requestToken = req[REQUEST_TOKEN]

  if (!requestToken) {
    throw new ForbiddenError(MESSAGES.MISSING_TOKEN_IN_DISCARD_TOKEN_MIDDLEWARE)
  }

  const deletedTokenId = await SERVICES.deleteToken({ tokenId: requestToken.id })

  if (!deletedTokenId || deletedTokenId !== requestToken?.id) {
    throw new ForbiddenError(`${MESSAGES.ERROR_DISCARDING_TOKEN} ${requestToken.id}`)
  }

  next()
}
export default discardToken
