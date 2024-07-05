import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"
import { eq } from "drizzle-orm"
import db from "../db"
import { tableTokens } from "../db/schema"

/**
 * Middleware for discarding a token after it has been used.
 */
const discardToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tokenWithUser } = req

    if (!tokenWithUser) {
      logger.error(`Missing tokenWithUser object in discardToken middleware`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Token expired")
    }

    const updatedToken = await db.update(tableTokens).set({ used: true }).where(eq(tableTokens.id, tokenWithUser.id))

    if (updatedToken.rowCount !== 1) {
      logger.error(`Error expiring token: ${tokenWithUser.id}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Token expired")
    }

    // Probably just delete it here instead of setting it to used

    next()
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error")
  }
}

export default discardToken
