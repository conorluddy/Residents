import db from "../../db"
import { eq } from "drizzle-orm"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"
import { UserUpdate } from "../../db/types"
import { isEmail, isStrongPassword, normalizeEmail } from "validator"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { PasswordError } from "../../utils/errors"

interface Params {
  userId: string
  username?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  password?: string | null
}

const updateUser = async ({ userId, username, firstName, lastName, email, password }: Params): Promise<string> => {
  try {
    if (!userId) {
      logger.error("No ID provided for user update.")
      throw new Error("User ID must be provided.")
    }

    if (email && !isEmail(email))
      throw new Error(`You need to use a valid email address if you want to update an email. ${email} is not valid.`)

    const emailNormalized = email ? normalizeEmail(email, { all_lowercase: true }) : undefined

    if (email && !emailNormalized) throw new Error("Requested email for updating is invalid.")

    const updatedUserProperties: Partial<UserUpdate> = {
      ...(username && { username }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(emailNormalized && { email: emailNormalized }),
      ...(password && { password }),
    }

    if (Object.keys(updatedUserProperties).length === 0)
      throw new Error("At least one property must be provided for update.")

    if (updatedUserProperties.password && !isStrongPassword(updatedUserProperties.password, PASSWORD_STRENGTH_CONFIG))
      throw new PasswordError("Password not strong enough, try harder.")

    const [{ updatedUserId }] = await db
      .update(tableUsers)
      .set(updatedUserProperties)
      .where(eq(tableUsers.id, userId))
      .returning({ updatedUserId: tableUsers.id })

    return updatedUserId
  } catch (error) {
    logger.error("Error updating user with ID:", userId, error)
    throw new Error("Error updating user.")
  }
}

export { updateUser }
