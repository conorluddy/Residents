import { NextFunction, Request, RequestHandler, Response } from "express"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import SERVICES from "../../services"
import { ForbiddenError } from "../../errors"

/**
 * Middleware for discarding a token after it has been used.
 */
const discardToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const requestToken = req[REQUEST_TOKEN]

  if (!requestToken) throw new ForbiddenError("Missing token in discardToken middleware.")

  const deletedTokenId = await SERVICES.deleteToken({ tokenId: requestToken.id })

  if (!deletedTokenId || deletedTokenId !== requestToken?.id)
    throw new ForbiddenError(`Error expiring token ID: ${requestToken.id}`)

  next()
}
export default discardToken
