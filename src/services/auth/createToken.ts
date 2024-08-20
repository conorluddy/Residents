import db from "../../db"
import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"
import { tableTokens } from "../../db/schema"
import { Token } from "../../db/types"
import { logger } from "../../utils/logger"

interface Props {
  userId: string
  type: TOKEN_TYPE
  expiry: TIMESPAN
}

const createToken = async ({ userId, type, expiry = TIMESPAN.MINUTE }: Props): Promise<Token | null> => {
  try {
    if (!userId) throw new Error("Token requires a UserID, none provided")
    if (!type) throw new Error("Token type is required, none provided")

    const [token] = await db
      .insert(tableTokens)
      .values({
        userId,
        type,
        expiresAt: new Date(Date.now() + expiry),
      })
      .returning()

    return token
  } catch (error) {
    logger.error("Error creating token", error)
    throw new Error("Error creating token")
  }
}

export { createToken }
