import { eq } from "drizzle-orm"
import db from "../db"

import { User, tableUsers } from "../db/schema"

/**
 * Finds a user by username or email.
 */
export const findUserByUsernameOrEmail = async (username?: string, email?: string): Promise<User[]> => {
  if (username) return await db.select().from(tableUsers).where(eq(tableUsers.username, username))
  if (email) return await db.select().from(tableUsers).where(eq(tableUsers.email, email))
  return []
}
