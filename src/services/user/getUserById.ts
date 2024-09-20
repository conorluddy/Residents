import { eq } from 'drizzle-orm'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { SafeUser } from '../../db/types'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'

const getUserById = async (id: string): Promise<SafeUser | null> => {
  if (!id) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }

  const [user] = await db
    .select({
      id: tableUsers.id,
      username: tableUsers.username,
      firstName: tableUsers.firstName,
      lastName: tableUsers.lastName,
      email: tableUsers.email,
      role: tableUsers.role,
      status: tableUsers.status,
      createdAt: tableUsers.createdAt,
      deletedAt: tableUsers.deletedAt,
    })
    .from(tableUsers)
    .where(eq(tableUsers.id, id))

  return user
}

export { getUserById }
