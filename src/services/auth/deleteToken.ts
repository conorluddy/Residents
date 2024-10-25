import MESSAGES from '../../constants/messages'
import db from '../../db'
import { tableTokens } from '../../db/schema'
import { Token } from '../../db/types'
import { TokenError } from '../../errors'
import { eq } from 'drizzle-orm'

interface DeleteTokenProps {
  tokenId: string
}

const deleteToken = async ({ tokenId }: DeleteTokenProps): Promise<Token['id']> => {
  if (!tokenId) {
    throw new TokenError(MESSAGES.NO_TOKEN_ID_PROVIDED)
  }
  const [deleted] = await db.delete(tableTokens).where(eq(tableTokens.id, tokenId)).returning()
  return deleted?.id
}

export { deleteToken, DeleteTokenProps }
