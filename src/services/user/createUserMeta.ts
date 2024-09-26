import db from '../../db'
import { tableUserMeta } from '../../db/schema'
import { Meta } from '../../db/types'

/**
 * createUserMeta
 * Service to create a user meta record.
 * Initially we'll just be creating a record with the userId when the user is created.
 * Updates to this record will be made as we add more features.
 * @param {userId} userId - The userId to create meta for
 * @returns {Promise<User["id"] | null>} - The new user object.
 */
const createUserMeta = async (userId: string): Promise<Meta['id'] | null> => {
  const [userMeta] = await db.insert(tableUserMeta).values({ userId }).returning()
  return userMeta.id
}

export { createUserMeta }
