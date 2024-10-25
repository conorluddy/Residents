import db from '../../db'
import { eq } from 'drizzle-orm'
import { tableUserMeta } from '../../db/schema'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface UpdateUserMetaParams {
  userId: string
  metaItem?: string | null // Example property - customise these properties to your needs
}

const updateUserMeta = async ({ userId, metaItem }: UpdateUserMetaParams): Promise<string> => {
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  if (!metaItem) {
    throw new BadRequestError(MESSAGES.NO_METADATA_PROVIDED_FOR_UPDATE)
  }

  const [updatedUser] = await db
    .update(tableUserMeta)
    .set({ metaItem })
    .where(eq(tableUserMeta.userId, userId))
    .returning({ updatedUserId: tableUserMeta.id })

  return updatedUser?.updatedUserId
}

export { updateUserMeta, UpdateUserMetaParams }
