import db from '../../db'
import { eq, desc } from 'drizzle-orm'
import { tableTokens } from '../../db/schema'
import { Token } from '../../db/types'
import { TokenError } from '../../errors'
import MESSAGES from '../../constants/messages'

interface GetTokenProps {
  tokenId: string
}

const getToken = async ({ tokenId }: GetTokenProps): Promise<Token | null> => {
  if (!tokenId) {
    throw new TokenError(MESSAGES.NO_TOKEN_ID_PROVIDED)
  }

  const [token] = await db
    .select()
    .from(tableTokens)
    .where(eq(tableTokens.id, tokenId))
    .orderBy(desc(tableTokens.createdAt))
    .limit(1)

  return token
}

export { getToken, GetTokenProps }
