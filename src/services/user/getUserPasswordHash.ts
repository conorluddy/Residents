import { eq } from 'drizzle-orm'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'

const getUserPasswordHash = async (id: string): Promise<string | null> => {
  if (!id) {
    throw new BadRequestError(MESSAGES.NO_ID_PROVIDED)
  }
  const [user] = await db.select({ password: tableUsers.password }).from(tableUsers).where(eq(tableUsers.id, id))
  return user.password
}

export { getUserPasswordHash }
