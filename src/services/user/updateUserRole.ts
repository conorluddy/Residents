import { eq } from 'drizzle-orm'
import { ROLES, ROLES_ARRAY } from '../../constants/database'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError, ValidationError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface Params {
  userId: string
  role: ROLES
}

const updateUserRole = async ({ userId, role }: Params): Promise<string> => {
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (!role) {
    throw new BadRequestError(MESSAGES.ROLE_REQUIRED)
  }
  if (!ROLES_ARRAY.includes(role)) {
    throw new ValidationError(MESSAGES.INVALID_ROLE)
  }

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set({ role })
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { updateUserRole }
