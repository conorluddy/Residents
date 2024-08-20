import { eq } from "drizzle-orm"
import { tableUsers, User } from "../../db/schema"
import { SafeUser } from "../../db/types"
import { logger } from "../../utils/logger"
import db from "../../db"
import { isEmail } from "validator"

const getUserByID = async (id: string): Promise<SafeUser | null> => {
  try {
    if (!id) throw new Error("No ID provided")

    const [user] = await db
      .select({
        id: tableUsers.id,
        username: tableUsers.username,
        firstName: tableUsers.firstName,
        lastName: tableUsers.lastName,
        email: tableUsers.email,
        role: tableUsers.role,
        status: tableUsers.status,
        createdAt: tableUsers.createdAt,
        deletedAt: tableUsers.deletedAt,
      })
      .from(tableUsers)
      .where(eq(tableUsers.id, id))

    return user
  } catch (error) {
    logger.error("Error getting user by ID", error)
    throw new Error("Error getting user by ID")
  }
}

const getUserPasswordHash = async (id: string): Promise<string | null> => {
  try {
    if (!id) throw new Error("No ID provided")
    const [user] = await db.select({ password: tableUsers.password }).from(tableUsers).where(eq(tableUsers.id, id))
    return user.password
  } catch (error) {
    logger.error("Error getting hashed user password by ID", error)
    throw new Error("Error getting hashed user password by ID")
  }
}

const getUserByEmail = async (email: string): Promise<SafeUser | null> => {
  try {
    if (!email) return null
    if (!isEmail(email)) return null

    const [user] = await db
      .select({
        id: tableUsers.id,
        username: tableUsers.username,
        firstName: tableUsers.firstName,
        lastName: tableUsers.lastName,
        email: tableUsers.email,
        role: tableUsers.role,
        status: tableUsers.status,
        createdAt: tableUsers.createdAt,
        deletedAt: tableUsers.deletedAt,
      })
      .from(tableUsers)
      .where(eq(tableUsers.email, email.toLowerCase()))

    return user
  } catch (error) {
    logger.error("Error getting user by Email", error)
    throw new Error("Error getting user by Email")
  }
}

export { getUserByID, getUserByEmail, getUserPasswordHash }
