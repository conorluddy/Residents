import { NextFunction, Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { createHash } from "../../utils/crypt"
import { tableUsers } from "../../db/schema/Users"
import { eq } from "drizzle-orm"
import { TOKEN_TYPE } from "../../constants/database"
import { isStrongPassword } from "validator"
import db from "../../db"

/**
 * resetPasswordWithToken
 * POST
 */
export const resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tokenWithUser } = req
    const { password: plainPassword } = req.body
    // Alternatively here we can generate a temporary PW and email it to the user, and make that configurable for the app

    if (!tokenWithUser || !tokenWithUser.user.id) {
      logger.error(`Missing tokenWithUser data in resetPasswordWithToken controller`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Token expired")
    }

    if (tokenWithUser.type !== TOKEN_TYPE.RESET) {
      logger.error(`Invalid token type for reset password: ${tokenWithUser.id}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Invalid token type")
    }

    // Centralise configuration for this somewhere - can use it for registration too
    if (
      !isStrongPassword(plainPassword, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
      })
    ) {
      // Note: Token is discarded here - so they'd need to start the whole flow again if they mess this up. Maybe it should be more forgiving?
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password not strong enough, try harder" })
    }

    const password = await createHash(plainPassword)

    const result = await db
      .update(tableUsers)
      .set({ password })
      .where(eq(tableUsers.id, tokenWithUser.user.id))
      .returning({ updatedId: tableUsers.id })

    if (result[0].updatedId !== tokenWithUser.user.id) {
      logger.error(
        `Error updating password for user: ${tokenWithUser.user.id}, db-update result: ${JSON.stringify(result[0])}`
      )
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating password" })
    }

    logger.info(`Password successfully reset for ${tokenWithUser.user.email}`)
    return res.status(HTTP_SUCCESS.OK).json({ message: "Password successfully updated" })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" })
  }
}
