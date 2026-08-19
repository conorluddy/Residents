import db from '../../db'
import { and, eq, desc } from 'drizzle-orm'
import { tableTokens } from '../../db/schema'
import { Token } from '../../db/types'
import { TokenError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { TOKEN_TYPE } from '../../constants/database'

interface GetTokenProps {
  tokenId: string
  // Optional only for findValidTokenById's shared any-type lookup. Every other caller
  // MUST pass this — otherwise a token minted for one purpose (e.g. a magic-login
  // link) can be replayed as another (e.g. a refresh token).
  type?: TOKEN_TYPE
}

const getToken = async ({ tokenId, type }: GetTokenProps): Promise<Token | null> => {
  if (!tokenId) {
    throw new TokenError(MESSAGES.NO_TOKEN_ID_PROVIDED)
  }

  const [token] = await db
    .select()
    .from(tableTokens)
    .where(type ? and(eq(tableTokens.id, tokenId), eq(tableTokens.type, type)) : eq(tableTokens.id, tokenId))
    .orderBy(desc(tableTokens.createdAt))
    .limit(1)

  return token
}

export { getToken, GetTokenProps }
