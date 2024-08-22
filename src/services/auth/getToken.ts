import { eq } from "drizzle-orm"
import db from "../../db"
import { tableTokens } from "../../db/schema"
import { Token } from "../../db/types"
import { logger } from "../../utils/logger"

interface Props {
  tokenId: string
}

const getToken = async ({ tokenId }: Props): Promise<Token | null> => {
  try {
    if (!tokenId) throw new Error("No token ID provided")
    const [token] = await db.select().from(tableTokens).where(eq(tableTokens.userId))
    return token
  } catch (error) {
    logger.error("Error getting token", error)
    throw new Error("Error getting token")
  }
}

export { getToken }
