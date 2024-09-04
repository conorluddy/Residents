import db from "../../db"
import { tableUserMeta } from "../../db/schema"
import { Meta } from "../../db/types"

/**
 * createUserMeta - Service to create a user meta record.
 * @param {userId} userId - The userId to create meta for
 * @returns {Promise<User["id"] | null>} - The new user object.
 */
const createUserMeta = async (userId: string): Promise<Meta["id"] | null> => {
  const [userMeta] = await db.insert(tableUserMeta).values({ userId }).returning()
  return userMeta.id
}

export { createUserMeta }
