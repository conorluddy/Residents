import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import SERVICES from "../../services"
import { REQUEST_TOKEN, REQUEST_TOKEN_ID } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

/**
 * Middleware for finding a token and the user it belongs to.
 */
const findValidTokenById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId = req[REQUEST_TOKEN_ID]

    if (!tokenId) {
      logger.error(`Valid token required`)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: `Valid token required` })
    }

    const token = await SERVICES.getToken({ tokenId })

    if (!token) {
      logger.error(`Token not found: ${tokenId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token expired" })
    }

    if (token.used) {
      logger.error(`Attempt to use a used token: ${tokenId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token has already been used" })
    }

    if (token.expiresAt < new Date()) {
      logger.error(`Attempt to use an expired token: ${tokenId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token has expired" })
    }

    // Should probably compare the token.type here too with the URL to ensure reset password token is used for reset password etc

    req[REQUEST_TOKEN] = token
    next()
  } catch (error) {
    logger.error(`Error finding user by valid token: ${error}`)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error" })
  }
}

export default findValidTokenById
