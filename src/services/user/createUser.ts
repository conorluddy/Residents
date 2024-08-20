import { isEmail, isStrongPassword, normalizeEmail } from "validator"
import db from "../../db"
import { NewUser, tableUsers, User } from "../../db/schema"
import { logger } from "../../utils/logger"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { createHash } from "../../utils/crypt"
import { ROLES } from "../../constants/database"

/**
 * createUser - Service to create a new user.
 * @param {NewUser} user - The new user object.
 * @returns {Promise<SafeUser | null>} - The new user object.
 */
const createUser = async ({ username, firstName, lastName, email, password }: NewUser): Promise<User["id"] | null> => {
  try {
    if (!username || !firstName || !lastName || !email || !password) {
      throw new Error("Missing required fields.")
    }

    if (!isStrongPassword(password, PASSWORD_STRENGTH_CONFIG)) {
      throw new Error("Password not strong enough, try harder.")
    }

    if (!isEmail(email)) {
      throw new Error("Email needs to be a valid email.")
    }

    const normalisedEmail = normalizeEmail(email, { all_lowercase: true })

    if (!normalisedEmail) {
      throw new Error(`Problem with email normalization for ${email}`)
    }

    const hashedPassword = await createHash(password)

    const newUser: NewUser = {
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: normalisedEmail,
      password: hashedPassword,
      //
      role: ROLES.DEFAULT, // TODO: Need only allow roles below current users role
    }

    const [user] = await db.insert(tableUsers).values(newUser).returning()

    return user.id
  } catch (error) {
    logger.error("Error creating new user", error)
    throw new Error("Error creating new user")
  }
}

export { createUser }
