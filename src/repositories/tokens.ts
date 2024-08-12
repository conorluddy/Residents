// src/repositories/tokenRepository.ts

import db from "../db"
import { tableTokens } from "../db/schema"
import { NewToken } from "../db/types"

/**
 * Inserts a new refresh token into the database.
 */
export const insertRefreshToken = async (newToken: NewToken) => {
  const [refreshToken] = await db.insert(tableTokens).values(newToken).returning()
  return refreshToken
}
