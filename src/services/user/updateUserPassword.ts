import { eq } from 'drizzle-orm'
import { isStrongPassword } from 'validator'
import { PASSWORD_STRENGTH_CONFIG } from '../../constants/password'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError, PasswordStrengthError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface UpdateUserPasswordParams {
  userId: string
  password?: string
}

const updateUserPassword = async ({ userId, password }: UpdateUserPasswordParams): Promise<string> => {
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (!password) {
    throw new BadRequestError(MESSAGES.PASSWORD_NEEDED)
  }
  if (!isStrongPassword(password, PASSWORD_STRENGTH_CONFIG)) {
    throw new PasswordStrengthError()
  }

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set({ password })
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { updateUserPassword, UpdateUserPasswordParams }
