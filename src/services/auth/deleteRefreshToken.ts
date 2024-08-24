import { and, eq } from "drizzle-orm"
import { TOKEN_TYPE } from "../../constants/database"
import db from "../../db"
import { tableTokens } from "../../db/schema"
import { Token } from "../../db/types"
import { logger } from "../../utils/logger"

interface Props {
  userId: string
}

const deleteRefreshToken = async ({ userId }: Props): Promise<Token["id"] | null> => {
  try {
    if (!userId) throw new Error("No token ID provided")
    const [deleted] = await db
      .delete(tableTokens)
      .where(and(eq(tableTokens.userId, userId), eq(tableTokens.type, TOKEN_TYPE.REFRESH)))
      .returning()
    return deleted.id
  } catch (error) {
    logger.error("Error deleting refresh token", error)
    throw new Error("Error deleting refresh token")
  }
}

export { deleteRefreshToken }
