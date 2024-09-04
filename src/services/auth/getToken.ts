import { eq } from "drizzle-orm"
import db from "../../db"
import { tableTokens } from "../../db/schema"
import { Token } from "../../db/types"
import { TokenError } from "../../errors"

interface Props {
  tokenId: string
}

const getToken = async ({ tokenId }: Props): Promise<Token | null> => {
  if (!tokenId) throw new TokenError("No token ID provided")
  const [token] = await db.select().from(tableTokens).where(eq(tableTokens.userId, tokenId))
  return token
}

export { getToken }
