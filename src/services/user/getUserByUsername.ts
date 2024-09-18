import db from '../../db'
import { eq } from 'drizzle-orm'
import { tableUsers } from '../../db/schema'
import { SafeUser } from '../../db/types'
import { BadRequestError } from '../../errors'

const getUserByUsername = async (username: string): Promise<SafeUser | null> => {
  if (!username) {throw new BadRequestError('No username provided')}

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
    .where(eq(tableUsers.username, username.toLowerCase()))

  return user
}

export { getUserByUsername }
