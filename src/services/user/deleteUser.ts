import { eq } from 'drizzle-orm'
import { STATUS } from '../../constants/database'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError } from '../../errors'

interface Params {
  userId: string
}

const deleteUser = async ({ userId }: Params): Promise<string> => {
  if (!userId) {
    throw new BadRequestError('User ID must be provided.')
  }

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set({ deletedAt: new Date(), status: STATUS.DELETED })
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { deleteUser }
