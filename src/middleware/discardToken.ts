import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"
import { eq } from "drizzle-orm"
import db from "../db"
import { tableTokens } from "../db/schema"
import { TokenWithUser } from "../db/types"

/**
 * Middleware for discarding a token after it has been used.
 */
const discardToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenWithUser: TokenWithUser = req.tokenWithUser

    if (!tokenWithUser) {
      logger.error(`Missing token in discardToken middleware`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token invalid" })
    }

    const [updatedToken] = await db
      .update(tableTokens)
      .set({ used: true })
      .where(eq(tableTokens.id, tokenWithUser.id))
      .returning()

    if (!updatedToken || updatedToken?.id !== tokenWithUser?.id) {
      logger.error(`Error expiring token ID:${tokenWithUser.id}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token invalid" })
    }

    // Probably just delete it here instead of setting it to used
    next()
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error" })
  }
}

export default discardToken
