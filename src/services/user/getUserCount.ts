import db from "../../db"
import { count } from "drizzle-orm"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"

const getUserCount = async (): Promise<number> => {
  try {
    const [result] = await db.select({ count: count() }).from(tableUsers)
    return result.count ?? 0
  } catch (error) {
    logger.error("Service: getUserCount: DB error getting user count")
    throw new Error("Error getting user count")
  }
}

export { getUserCount }
