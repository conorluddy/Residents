import { eq } from 'drizzle-orm'
import { STATUS } from '../../constants/database'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface Params {
  userId: string
}

const deleteUser = async ({ userId }: Params): Promise<string> => {
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set({ deletedAt: new Date(), status: STATUS.DELETED })
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { deleteUser }
