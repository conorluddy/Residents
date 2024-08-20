import { Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import db from "../../db"
import { tableUserMeta } from "../../db/schema"
import SERVICES from "../../services"
import { logger } from "../../utils/logger"

/**
 * createUser - Controller to handle user creation.
 */
export const createUser = async ({ body }: Request, res: Response) => {
  try {
    const { username, firstName, lastName, email, password }: Record<string, string> = body

    const userId = await SERVICES.createUser({
      username,
      firstName,
      lastName,
      email,
      password,
    })

    if (!userId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Error creating user" })
    }

    // Create a user meta object for the user for later use
    await db.insert(tableUserMeta).values({ userId }).returning()

    // Create a validation token for the user
    const token = await SERVICES.createToken({
      userId,
      type: TOKEN_TYPE.VALIDATE,
      expiry: TIMESPAN.WEEK,
    })

    if (token) {
      // await sendMail({
      //   to: SENDGRID_TEST_EMAIL ?? "", // Faker might seed with real emails, be careful not to spam people
      //   subject: "Validate your account",
      //   body: `Click here to validate your account: http://localhost:3000/auth/validate/${token.id}.${createdUser.id}`,
      // })
    }

    return res.status(HTTP_SUCCESS.CREATED).json({ message: "User registered." })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" })
  }
}
