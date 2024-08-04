import { Request, Response } from "express"
import { isEmail, isStrongPassword, normalizeEmail } from "validator"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { NewUser, tableTokens, tableUserMeta, tableUsers } from "../../db/schema"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { NewToken } from "../../db/types"
import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"

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
    const email = normalizeEmail(plainEmail)

    if (!email) {
      throw new Error(`Problem with email normalization for ${plainEmail}`)
    }

    // Create a new user object
    const newUser: NewUser = { firstName, lastName, email, username, password }

    // Insert the user into the database
    const [createdUser] = await db.insert(tableUsers).values(newUser).returning()

    // Create a user meta object for the user for later use
    await db.insert(tableUserMeta).values({ userId: createdUser.id }).returning()

    // Create a validation token for the user
    await db
      .insert(tableTokens)
      .values({
        userId: createdUser.id,
        type: TOKEN_TYPE.VALIDATE,
        expiresAt: new Date(Date.now() + TIMESPAN.WEEK), // Make configurable
      })
      .returning()

    // Respond with success
    return res.status(HTTP_SUCCESS.CREATED).json({ message: "User registered." })
  } catch (error) {
    console.log(error)

    // Log the error and respond with an error message
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" })
  }
}
