import { Request, Response } from "express"
import { isEmail, isStrongPassword, normalizeEmail } from "validator"
import { SENDGRID_TEST_EMAIL } from "../../config"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { TIMESPAN } from "../../constants/time"
import db from "../../db"
import { NewUser, tableUserMeta, tableUsers } from "../../db/schema"
import { NewToken } from "../../db/types"
import SERVICES from "../../services"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"

/**
 * createUser - Controller to handle user creation.
 */
export const createUser = async ({ body }: Request, res: Response) => {
  try {
    const { username, firstName, lastName, email: plainEmail, password: plainPassword }: Record<string, string> = body

    // Validate email
    if (!isEmail(plainEmail)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Email needs to be a valid email." })
    }

    // Validate password strength
    if (!isStrongPassword(plainPassword, PASSWORD_STRENGTH_CONFIG)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password not strong enough, try harder." })
    }

    // Hash the password
    const password = await createHash(plainPassword)

    // Normalize the email
    const email = normalizeEmail(plainEmail, { all_lowercase: true })

    if (!email) {
      throw new Error(`Problem with email normalization for ${plainEmail}`)
    }

    // Create a new user object
    const newUser: NewUser = {
      username: username.toLowerCase(),
      firstName,
      lastName,
      email,
      password,
    }

    // Insert the user into the database
    const [createdUser] = await db.insert(tableUsers).values(newUser).returning()

    // Create a user meta object for the user for later use
    const [meta] = await db.insert(tableUserMeta).values({ userId: createdUser.id }).returning()

    // Create a validation token for the user
    const token = await SERVICES.createToken({
      userId: createdUser.id,
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
