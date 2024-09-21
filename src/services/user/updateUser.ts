import db from '../../db'
import { eq } from 'drizzle-orm'
import { tableUsers } from '../../db/schema'
import { UserUpdate } from '../../db/types'
import { isEmail, isStrongPassword, normalizeEmail } from 'validator'
import { PASSWORD_STRENGTH_CONFIG } from '../../constants/password'
import { BadRequestError, EmailError, PasswordStrengthError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface Params {
  userId: string
  username?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  password?: string | null
}

const updateUser = async ({ userId, username, firstName, lastName, email, password }: Params): Promise<string> => {
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (email && !isEmail(email)) {
    throw new EmailError(MESSAGES.INVALID_EMAIL)
  }

  const emailNormalized = email ? normalizeEmail(email, { all_lowercase: true }) : null
  if (email && !emailNormalized) {
    throw new EmailError(MESSAGES.INVALID_EMAIL)
  }

  const updatedUserProperties: Partial<UserUpdate> = {
    ...(username && { username }),
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(emailNormalized && { email: emailNormalized }),
    ...(password && { password }),
  }

  if (Object.keys(updatedUserProperties).length === 0) {
    throw new BadRequestError(MESSAGES.AT_LEAST_ONE_PROPERTY_REQUIRED)
  }

  if (updatedUserProperties.password && !isStrongPassword(updatedUserProperties.password, PASSWORD_STRENGTH_CONFIG)) {
    throw new PasswordStrengthError()
  }

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set(updatedUserProperties)
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { updateUser }
