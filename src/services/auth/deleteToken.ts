import db from '../../db'
import { tableTokens } from '../../db/schema'
import { Token } from '../../db/types'
import { TokenError } from '../../errors'
import { eq } from 'drizzle-orm'

interface Props {
  tokenId: string
}

const deleteToken = async ({ tokenId }: Props): Promise<Token['id'] | null> => {
  if (!tokenId) {throw new TokenError('No token ID provided')}
  const [deleted] = await db.delete(tableTokens).where(eq(tableTokens.id, tokenId)).returning()
  return deleted?.id ?? null
}

export { deleteToken }
