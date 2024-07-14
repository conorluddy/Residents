import { NextFunction, Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { createHash } from "../../utils/crypt"
import { tableUsers } from "../../db/schema/Users"
import { eq } from "drizzle-orm"
import { TOKEN_TYPE } from "../../constants/database"
import { isStrongPassword } from "validator"
import db from "../../db"
import { TokenWithUser } from "../../db/types"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"

/**
 * resetPasswordWithToken
 * POST
 */
export const resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenWithUser: TokenWithUser = req.tokenWithUser
    const plainPassword: string = req.body.password
    // Alternatively here we can generate a temporary PW and email it to the user, and make that configurable for the app

    if (!tokenWithUser || !tokenWithUser.user.id) {
      logger.error(`Missing tokenWithUser data in resetPasswordWithToken controller`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token missing." })
    }

    if (tokenWithUser.type !== TOKEN_TYPE.RESET) {
      logger.error(`An incorrect token type was used in an attempt to reset a password: TID:${tokenWithUser.id}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Invalid token type." })
    }

    // Centralise configuration for this somewhere - can use it for registration too
    if (!isStrongPassword(plainPassword, PASSWORD_STRENGTH_CONFIG)) {
      // Note: Token is discarded in the MW before it gets here,
      // so they'd need to start the whole flow again if they mess this up.
      // Maybe it should be more forgiving or autogenerate a new token and redirect to a new link?
      logger.error("Password reset attempt failed with weak password.")
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password not strong enough, try harder." })
    }

    const password = await createHash(plainPassword)

    const result = await db
      .update(tableUsers)
      .set({ password })
      .where(eq(tableUsers.id, tokenWithUser.user.id))
      .returning({ updatedUserId: tableUsers.id })

    // This case should never happen but will leave it here for now
    if (result[0].updatedUserId !== tokenWithUser.user.id) {
      logger.error(
        `Error updating password for user: ${
          tokenWithUser.user.id
        }, db-update result (should be empty or same as request ID): ${JSON.stringify(result[0])}`
      )
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating password." })
    }

    logger.info(`Password successfully reset for ${tokenWithUser.user.email}`)
    return res.status(HTTP_SUCCESS.OK).json({ message: "Password successfully updated." })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating password." })
  }
}
