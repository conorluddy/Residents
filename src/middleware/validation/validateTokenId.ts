import { NextFunction, Request, RequestHandler, Response } from 'express'
import { isCuid } from '@paralleldrive/cuid2'
import { REQUEST_TOKEN_ID } from '../../types/requestSymbols'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'

const validateTokenId: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const tokenId: string | undefined = req.params?.tokenId || req.body?.tokenId || req.query?.tokenId
  if (!tokenId) {
    throw new BadRequestError(MESSAGES.TOKEN_REQUIRED)
  }
  if (!isCuid(tokenId)) {
    throw new BadRequestError(MESSAGES.TOKEN_INVALID)
  }
  req[REQUEST_TOKEN_ID] = tokenId
  next()
}

export default validateTokenId
