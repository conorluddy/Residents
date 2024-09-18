import { eq } from 'drizzle-orm'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError } from '../../errors'

const getUserPasswordHash = async (id: string): Promise<string | null> => {
  if (!id) {throw new BadRequestError('No ID provided')}
  const [user] = await db.select({ password: tableUsers.password }).from(tableUsers).where(eq(tableUsers.id, id))
  return user.password
}

export { getUserPasswordHash }
