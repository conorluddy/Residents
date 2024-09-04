import { NextFunction, Request, Response } from "express"
import { isStrongPassword } from "validator"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { DatabaseError, PasswordStrengthError, TokenError } from "../../errors"
import SERVICES from "../../services"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"

/**
 * resetPasswordWithToken
 * POST
 */
export const resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req[REQUEST_TOKEN]
  const plainPassword: string = req.body.password

  // Alternatively here we can generate a temporary PW and email it to the user,
  // and make that configurable for the app. Probably overlaps with magic login.

  if (!token || !token.userId) throw new TokenError("Token missing.")

  if (token.type !== TOKEN_TYPE.RESET) throw new TokenError("Invalid token type.")

  // Centralise configuration for this somewhere - can use it for registration too
  if (!isStrongPassword(plainPassword, PASSWORD_STRENGTH_CONFIG))
    throw new PasswordStrengthError("Password not strong enough, try harder.")

  const password = await createHash(plainPassword)

  const updatedUserId = await SERVICES.updateUserPassword({ userId: token.userId, password })

  // This case should never happen but will leave it here for now
  if (updatedUserId !== token.userId)
    throw new DatabaseError(
      `Error updating password for user: ${token.userId}, the DB update result should be the same as request ID: ${updatedUserId}`
    )

  logger.info(`Password was reset for USER:${token.userId}`)

  return res.status(HTTP_SUCCESS.OK).json({ message: "Password successfully updated." })
}
