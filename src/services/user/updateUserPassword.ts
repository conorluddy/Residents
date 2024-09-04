import { eq } from "drizzle-orm"
import { isStrongPassword } from "validator"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { BadRequestError, PasswordStrengthError } from "../../errors"

interface Params {
  userId: string
  password?: string
}

const updateUserPassword = async ({ userId, password }: Params): Promise<string> => {
  if (!userId) throw new BadRequestError("User ID must be provided.")
  if (!password) throw new BadRequestError("You need a password.")
  if (!isStrongPassword(password, PASSWORD_STRENGTH_CONFIG)) throw new PasswordStrengthError()

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set({ password })
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { updateUserPassword }
