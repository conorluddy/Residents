import db from '../../db'
import { eq } from 'drizzle-orm'
import { tableTokens } from '../../db/schema'
import { TokenError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface DeleteAllUserTokensProps {
  userId: string
}

const deleteAllUserTokens = async ({ userId }: DeleteAllUserTokensProps): Promise<number> => {
  if (!userId) {
    throw new TokenError(MESSAGES.MISSING_USER_ID)
  }

  const deleted = await db.delete(tableTokens).where(eq(tableTokens.userId, userId)).returning()

  return deleted.length
}

export { deleteAllUserTokens, DeleteAllUserTokensProps }
