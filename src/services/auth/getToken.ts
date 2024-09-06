import db from "../../db"
import { eq, desc } from "drizzle-orm"
import { tableTokens } from "../../db/schema"
import { Token } from "../../db/types"
import { TokenError } from "../../errors"

interface Props {
  tokenId: string
}

const getToken = async ({ tokenId }: Props): Promise<Token | null> => {
  if (!tokenId) throw new TokenError("No token ID provided")

  const [token] = await db
    .select()
    .from(tableTokens)
    .where(eq(tableTokens.id, tokenId))
    .orderBy(desc(tableTokens.createdAt))
    .limit(1)

  return token
}

export { getToken }
