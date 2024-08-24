import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import { STATUS, TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import SERVICES from "../../services"
import { REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

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
    const token = await SERVICES.getToken({ tokenId })

    if (token?.type !== TOKEN_TYPE.VALIDATE) {
      logger.error(`Token with ID ${tokenId} isnt a validation type token.`)
      throw new Error("Invalid token type.")
    }

    // Compare the UserId and TokenId from the URL to the UserId from the JWT - probably overkill - URL might be enough
    if (!token || token?.userId !== userId || jwtUserId !== token?.userId) {
      logger.error(`Token x user mismatch.`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Validation token invalid." })
    }

    // Validate the user
    await db
      .update(tableUsers)
      .set({ status: STATUS.VERIFIED })
      .where(eq(tableUsers.id, userId))
      .returning({ updatedId: tableUsers.id })

    await SERVICES.deleteToken({ tokenId })

    logger.info(`User ${userId} validated.`)
    return res.status(HTTP_SUCCESS.OK).json({ message: "Account validated." })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error validating user." })
  }
}
