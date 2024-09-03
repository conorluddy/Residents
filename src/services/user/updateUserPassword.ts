import db from "../../db"
import { eq } from "drizzle-orm"
import { isStrongPassword } from "validator"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"
import { DatabaseError, PasswordError, PasswordStrengthError } from "../../errors"

interface Params {
  userId: string
  password?: string
}

const updateUserPassword = async ({ userId, password }: Params): Promise<string> => {
  try {
    if (!userId) throw new Error("User ID must be provided.")
    if (!password) throw new PasswordError("You need a password.")
    if (!isStrongPassword(password, PASSWORD_STRENGTH_CONFIG))
      throw new PasswordStrengthError("Password not strong enough, try harder.")

    const [{ updatedUserId }] = await db
      .update(tableUsers)
      .set({ password })
      .where(eq(tableUsers.id, userId))
      .returning({ updatedUserId: tableUsers.id })

    return updatedUserId
  } catch (error) {
    logger.error("Error updating user password:", userId, error)
    throw new DatabaseError("Error updating user password.")
  }
}

export { updateUserPassword }
