import { Request, Response } from "express"
import { isStrongPassword, normalizeEmail } from "validator"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { NewUser, tableUsers } from "../../db/schema"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"

/**
 * createUser
 */
export const createUser = async ({ body }: Request, res: Response) => {
  try {
    const { username, firstName, lastName, email: plainEmail, password: plainPassword }: Record<string, string> = body

    // Centralise configuration for this somewhere (MW)
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
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password not strong enough, try harder" })
    }

    const password = await createHash(plainPassword)
    const email = normalizeEmail(plainEmail)

    if (!email) {
      throw new Error(`Problem with email normalization for ${plainEmail}`)
    }

    const user: NewUser = {
      firstName,
      lastName,
      email,
      username,
      password,
    }
    await db.insert(tableUsers).values(user).returning()

    return res.status(HTTP_SUCCESS.CREATED).json({ message: "User registered" })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" })
  }
}
