import db from "../../db"
import { count } from "drizzle-orm"
import { tableUsers } from "../../db/schema"

const getUserCount = async (): Promise<number> => {
  const [result] = await db.select({ count: count() }).from(tableUsers)
  return result.count ?? 0
}

export { getUserCount }
