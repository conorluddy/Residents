import { Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import SERVICES from "../../services"
import { logger } from "../../utils/logger"
import { EmailError, PasswordError, ValidationError } from "../../utils/errors"
import { NewUser } from "../../db/types"

/**
 * createUser
 */
export const createUser = async ({ body }: Request, res: Response) => {
  try {
    const { username, firstName, lastName, email, password, role }: NewUser = body

    const userId = await SERVICES.createUser({ username, firstName, lastName, email, password, role })

    if (!userId) return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Error creating user" })

    await Promise.all([
      SERVICES.createUserMeta(userId),
      SERVICES.createToken({ userId, type: TOKEN_TYPE.VALIDATE, expiry: TIMESPAN.WEEK }),
    ])

    return res.status(HTTP_SUCCESS.CREATED).json({ message: "User registered." })
  } catch (error) {
    //
    // Centralise this stuff
    //
    if (error instanceof ValidationError) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: error.message })
    }
    if (error instanceof EmailError) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: error.message })
    }
    if (error instanceof PasswordError) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: error.message })
    }
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" })
  }
}

// if (token) {
// await sendMail({
//   to: SENDGRID_TEST_EMAIL ?? "", // Faker might seed with real emails, be careful not to spam people
//   subject: "Validate your account",
//   body: `Click here to validate your account: http://localhost:3000/auth/validate/${token.id}.${createdUser.id}`,
// })
// }
