import { eq } from 'drizzle-orm'
import { STATUS, STATUS_ARRAY } from '../../constants/database'
import db from '../../db'
import { tableUsers } from '../../db/schema'
import { BadRequestError, ValidationError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface UpdateUserStatusParams {
  userId: string
  status: STATUS
}

const updateUserStatus = async ({ userId, status }: UpdateUserStatusParams): Promise<string> => {
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (!status) {
    throw new BadRequestError(MESSAGES.STATUS_REQUIRED)
  }
  if (!STATUS_ARRAY.includes(status)) {
    throw new ValidationError(MESSAGES.INVALID_STATUS)
  }

  const [{ updatedUserId }] = await db
    .update(tableUsers)
    .set({ status })
    .where(eq(tableUsers.id, userId))
    .returning({ updatedUserId: tableUsers.id })

  return updatedUserId
}

export { updateUserStatus, UpdateUserStatusParams }
