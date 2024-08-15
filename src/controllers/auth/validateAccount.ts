import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { eq, and } from "drizzle-orm"
import { logger } from "../../utils/logger"
import { tableTokens, tableUsers, User } from "../../db/schema"
import { STATUS, TOKEN_TYPE } from "../../constants/database"
import { REQUEST_USER } from "../../types/requestSymbols"

/**
 * validateAccount
 */
export const validateAccount = async (req: Request, res: Response) => {
  try {
    // Get the token and userId from the request
    // if you're logged in though you could just
    // use the userId from the JWT
    const { tokenId, userId } = req.params
    const jwtUserId = req[REQUEST_USER]?.id

    const tokenWithUser = await db.query.tableTokens.findFirst({
      where: and(eq(tableTokens.id, tokenId), eq(tableTokens.type, TOKEN_TYPE.VALIDATE)),
      with: { user: true },
    })

    // Compare the UserId and TokenId from the URL to the UserId from the JWT - probably overkill - URL might be enough
    if (!tokenWithUser || tokenWithUser?.userId !== userId || jwtUserId !== tokenWithUser?.userId) {
      logger.error(`Token x user mismatch.`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Validation token invalid." })
    }

    // Validate the user
    const validatedUser = await db
      .update(tableUsers)
      .set({ status: STATUS.VERIFIED })
      .where(eq(tableUsers.id, userId))
      .returning({ updatedId: tableUsers.id })

    // Delete the token once used
    await db.delete(tableTokens).where(and(eq(tableTokens.id, tokenId), eq(tableTokens.type, TOKEN_TYPE.VALIDATE)))

    logger.info(`User ${userId} validated.`)
    return res.status(HTTP_SUCCESS.OK).json({ message: "Account validated." })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error validating user." })
  }
}
