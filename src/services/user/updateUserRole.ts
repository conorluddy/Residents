import { eq } from 'drizzle-orm'
import { ROLES, ROLES_ARRAY } from '../../constants/database'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError, ValidationError } from '../../errors'

interface Params {
  userId: string
  role: ROLES
}

const updateUserRole = async ({ userId, role }: Params): Promise<string> => {
  if (!userId) {throw new BadRequestError('User ID must be provided.')}
  if (!role) {throw new BadRequestError('Role must be provided.')}
  if (!ROLES_ARRAY.includes(role)) {throw new ValidationError('Invalid role provided.')}

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set({ role })
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { updateUserRole }
