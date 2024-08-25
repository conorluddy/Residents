import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { deleteToken } from "../../services/auth/deleteToken"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
/**
 * Middleware for discarding a token after it has been used.
 */
const discardToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestToken = req[REQUEST_TOKEN]

    if (!requestToken) {
      logger.error(`Missing token in discardToken middleware`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token invalid" })
    }

    // Probably just delete it here instead of setting it to used?
    const deletedTokenId = await deleteToken({ tokenId: requestToken.id })

    if (!deletedTokenId || deletedTokenId !== requestToken?.id) {
      logger.error(`Error expiring token ID:${requestToken.id}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token invalid" })
    }
    next()
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error" })
  }
}
export default discardToken
