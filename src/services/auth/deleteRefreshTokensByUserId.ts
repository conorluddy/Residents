import { and, eq } from 'drizzle-orm'
import { TOKEN_TYPE } from '../../constants/database'
import db from '../../db'
import { tableTokens } from '../../db/schema'
import { TokenError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface Props {
  userId: string
}

const deleteRefreshTokensByUserId = async ({ userId }: Props): Promise<number> => {
  if (!userId) {
    throw new TokenError(MESSAGES.MISSING_USER_ID)
  }

  const deleted = await db
    .delete(tableTokens)
    .where(and(eq(tableTokens.userId, userId), eq(tableTokens.type, TOKEN_TYPE.REFRESH)))
    .returning()

  return deleted.length
}

export { deleteRefreshTokensByUserId }
