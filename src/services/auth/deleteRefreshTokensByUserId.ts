import { and, eq } from 'drizzle-orm'
import { TOKEN_TYPE } from '../../constants/database'
import db from '../../db'
import { tableTokens } from '../../db/schema'
import { Token } from '../../db/types'
import { TokenError } from '../../errors'

interface Props {
  userId: string
}

const deleteRefreshTokensByUserId = async ({ userId }: Props): Promise<number> => {
  if (!userId) {throw new TokenError('No user ID provided')}

  const deleted = await db
    .delete(tableTokens)
    .where(and(eq(tableTokens.userId, userId), eq(tableTokens.type, TOKEN_TYPE.REFRESH)))
    .returning()

  return deleted.length
}

export { deleteRefreshTokensByUserId }
