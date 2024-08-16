import { eq } from "drizzle-orm"
import { tableUsers } from "../../db/schema"
import { SafeUser } from "../../db/types"
import { logger } from "../../utils/logger"
import db from "../../db"

const getUserByID = async (id: string): Promise<SafeUser | null> => {
  try {
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
    console.log("error", error)
    logger.error("Error getting user by ID", error)
    return null
  }
}

export { getUserByID }
