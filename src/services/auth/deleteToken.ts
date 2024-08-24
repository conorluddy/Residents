import db from "../../db"
import { tableTokens } from "../../db/schema"
import { Token } from "../../db/types"
import { logger } from "../../utils/logger"
import { eq, and } from "drizzle-orm"

interface Props {
  tokenId: string
}

const deleteToken = async ({ tokenId }: Props): Promise<Token["id"] | null> => {
  try {
    if (!tokenId) throw new Error("No token ID provided")
    const [deleted] = await db.delete(tableTokens).where(eq(tableTokens.id, tokenId)).returning()
    return deleted.id
  } catch (error) {
    logger.error("Error deleting token", error)
    throw new Error("Error deleting token")
  }
}

export { deleteToken }
