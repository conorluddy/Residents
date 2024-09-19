import { NextFunction, Request, RequestHandler, Response } from 'express'
import SERVICES from '../../services'
import { REQUEST_TOKEN, REQUEST_TOKEN_ID } from '../../types/requestSymbols'
import { BadRequestError, ForbiddenError } from '../../errors'
import MESSAGES from '../../constants/messages'

/**
 * Middleware for finding a token and the user it belongs to.
 */
const findValidTokenById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const tokenId = req[REQUEST_TOKEN_ID]

  if (!tokenId) {
    throw new BadRequestError(MESSAGES.VALID_TOKEN_REQUIRED)
  }
  const token = await SERVICES.getToken({ tokenId })

  if (!token) {
    throw new BadRequestError(MESSAGES.VALID_TOKEN_REQUIRED)
  }
  if (token.used) {
    throw new ForbiddenError(MESSAGES.TOKEN_USED)
  }
  if (token.expiresAt < new Date()) {
    throw new ForbiddenError(MESSAGES.TOKEN_EXPIRED)
  }

  req[REQUEST_TOKEN] = token
  req[REQUEST_TOKEN_ID] = token.id
  next()
}

export default findValidTokenById
