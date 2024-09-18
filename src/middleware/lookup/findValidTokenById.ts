import { NextFunction, Request, RequestHandler, Response } from 'express'
import SERVICES from '../../services'
import { REQUEST_TOKEN, REQUEST_TOKEN_ID } from '../../types/requestSymbols'
import { BadRequestError, ForbiddenError } from '../../errors'

/**
 * Middleware for finding a token and the user it belongs to.
 */
const findValidTokenById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const tokenId = req[REQUEST_TOKEN_ID]

  if (!tokenId) {throw new BadRequestError('A valid token is required.')}
  const token = await SERVICES.getToken({ tokenId })

  if (!token) {throw new BadRequestError('A valid token is required.')}
  if (token.used) {throw new ForbiddenError('Token has already been used.')}
  if (token.expiresAt < new Date()) {throw new ForbiddenError('Token has expired.')}

  req[REQUEST_TOKEN] = token
  req[REQUEST_TOKEN_ID] = token.id
  next()
}

export default findValidTokenById
