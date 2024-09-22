import db from '../../db'
import { TOKEN_TYPE, TOKEN_TYPE_ARRAY } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { tableTokens } from '../../db/schema'
import { Token } from '../../db/types'
import { TokenError } from '../../errors'
import MESSAGES from '../../constants/messages'
import {
  EXPIRATION_REFRESH_TOKEN_MS,
  EXPIRATION_PASSWORD_RESET_TOKEN_MS,
  EXPIRATION_MAGIC_LOGIN_TOKEN_MS,
  EXPIRATION_VALIDATION_TOKEN_MS,
} from '../../config'

interface Props {
  userId: string
  type: TOKEN_TYPE
  expiry?: TIMESPAN
}

const createToken = async ({ userId, type, expiry }: Props): Promise<Token['id'] | null> => {
  if (!userId) {
    throw new TokenError(MESSAGES.TOKEN_REQUIRES_USER_ID)
  }
  if (!type) {
    throw new TokenError(MESSAGES.TOKEN_TYPE_REQUIRED)
  }
  if (!TOKEN_TYPE_ARRAY.includes(type)) {
    throw new TokenError(MESSAGES.TOKEN_TYPE_INVALID)
  }
  if (expiry) {
    // Note: TODO: See if we want to use this or strictly use the ENV ones
  }

  const [token] = await db
    .insert(tableTokens)
    .values({
      userId,
      type,
      expiresAt: new Date(Date.now() + TOKEN_TYPE_EXPIRATION_MAP[type]),
    })
    .returning()

  return token.id
}

export { createToken }

const TOKEN_TYPE_EXPIRATION_MAP = {
  [TOKEN_TYPE.REFRESH]: EXPIRATION_REFRESH_TOKEN_MS,
  [TOKEN_TYPE.RESET]: EXPIRATION_PASSWORD_RESET_TOKEN_MS,
  [TOKEN_TYPE.MAGIC]: EXPIRATION_MAGIC_LOGIN_TOKEN_MS,
  [TOKEN_TYPE.VALIDATE]: EXPIRATION_VALIDATION_TOKEN_MS,
}
