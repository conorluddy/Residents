import { NextFunction, RequestHandler, Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableTokens } from "../../db/schema"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
/**
 * Middleware for discarding a token after it has been used.
 */
const discardToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req[REQUEST_TOKEN]

    if (!token) {
      logger.error(`Missing token in discardToken middleware`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token invalid" })
    }

    const [updatedToken] = await db
      .update(tableTokens)
      .set({ used: true })
      .where(eq(tableTokens.id, token.id))
      .returning()

    if (!updatedToken || updatedToken?.id !== token?.id) {
      logger.error(`Error expiring token ID:${token.id}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token invalid" })
    }

    // Probably just delete it here instead of setting it to used?

    next()
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error" })
  }
}
export default discardToken
