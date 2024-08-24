import { NextFunction, Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { createHash } from "../../utils/crypt"
import { TOKEN_TYPE } from "../../constants/database"
import { isStrongPassword } from "validator"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import SERVICES from "../../services"

/**
 * resetPasswordWithToken
 * POST
 */
export const resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req[REQUEST_TOKEN]
    const plainPassword: string = req.body.password
    // Alternatively here we can generate a temporary PW and email it to the user, and make that configurable for the app

    if (!token || !token.userId) {
      logger.error(`Missing token data in resetPasswordWithToken controller`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token missing." })
    }

    if (token.type !== TOKEN_TYPE.RESET) {
      logger.error(`An incorrect token type was used in an attempt to reset a password: TID:${token.id}`)
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

    const updatedUserId = await SERVICES.updateUser({ userId: token.userId, password })

    // This case should never happen but will leave it here for now
    if (updatedUserId !== token.userId) {
      logger.error(
        `Error updating password for user: ${token.userId}, db-update result (should be empty or same as request ID): ${updatedUserId}`
      )
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating password." })
    }

    logger.info(`Password successfully reset for USER${token.userId}`)
    return res.status(HTTP_SUCCESS.OK).json({ message: "Password successfully updated." })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating password." })
  }
}
