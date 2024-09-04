import db from "../../db"
import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"
import { tableTokens } from "../../db/schema"
import { Token } from "../../db/types"
import { TokenError } from "../../errors"

interface Props {
  userId: string
  type: TOKEN_TYPE
  expiry: TIMESPAN
}

const createToken = async ({ userId, type, expiry = TIMESPAN.MINUTE }: Props): Promise<Token["id"] | null> => {
  if (!userId) throw new TokenError("Token requires a UserID, none provided")
  if (!type) throw new TokenError("Token type is required, none provided")

  const [token] = await db
    .insert(tableTokens)
    .values({
      userId,
      type,
      expiresAt: new Date(Date.now() + expiry),
    })
    .returning()

  return token.id
}

export { createToken }
