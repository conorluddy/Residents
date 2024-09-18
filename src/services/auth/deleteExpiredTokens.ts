import db from '../../db'
import { eq, lt, or, sql } from 'drizzle-orm'
import { tableTokens } from '../../db/schema'

/**
 * deleteExpiredTokens
 * Utility to probably to be run on a cron job or similar
 * @returns number of tokens deleted
 */
const deleteExpiredTokens = async (): Promise<number> => {
  const result = await db
    .delete(tableTokens)
    .where(or(eq(tableTokens.used, true), lt(tableTokens.expiresAt, sql`now()`)))
    .returning({ deletedId: tableTokens.id })

  return result.length
}

export { deleteExpiredTokens }
