import db from '../../db'
import { eq } from 'drizzle-orm'
import { tableUsers } from '../../db/schema'
import { UserUpdate } from '../../db/types'
import { isEmail, isStrongPassword, normalizeEmail } from 'validator'
import { PASSWORD_STRENGTH_CONFIG } from '../../constants/password'
import { BadRequestError, EmailError, PasswordStrengthError } from '../../errors'

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
    throw new BadRequestError('User ID must be provided.')
  }
  if (email && !isEmail(email)) {
    throw new EmailError('Email is not valid.')
  }

  const emailNormalized = email ? normalizeEmail(email, { all_lowercase: true }) : null
  if (email && !emailNormalized) {
    throw new EmailError('Requested email for updating is invalid.')
  }

  const updatedUserProperties: Partial<UserUpdate> = {
    ...(username && { username }),
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(emailNormalized && { email: emailNormalized }),
    ...(password && { password }),
  }

  if (Object.keys(updatedUserProperties).length === 0) {
    throw new BadRequestError('At least one property must be provided for update.')
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
