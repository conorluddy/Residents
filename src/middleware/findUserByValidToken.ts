import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"
import { eq } from "drizzle-orm"
import db from "../db"
import { tableTokens } from "../db/schema"

/**
 * Middleware for finding a token and the user it belongs to.
 */
const findUserByValidToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { validatedToken } = req

    if (!validatedToken) {
      logger.error(`Valid token required`)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send(`Valid token required`)
    }

    const tokenWithUser = await db.query.tableTokens.findFirst({
      where: eq(tableTokens.id, validatedToken),
      with: { user: true },
    })

    if (!tokenWithUser) {
      logger.error(`Token not found: ${validatedToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Token expired")
    }

    if (tokenWithUser.used) {
      logger.error(`Attempt to use a used token: ${validatedToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Token has already been used")
    }

    if (tokenWithUser.expires_at < new Date()) {
      logger.error(`Attempt to use an expired token: ${validatedToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Token has expired")
    }

    // Should probably compare the token.type here too with the URL to ensure reset password token is used for reset password etc
    req.tokenWithUser = tokenWithUser
    next()
  } catch (error) {
    logger.error(`Error finding user by valid token: ${error}`)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error")
  }
}

export default findUserByValidToken
