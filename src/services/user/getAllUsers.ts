import { tableUsers } from "../../db/schema"
import { SafeUser } from "../../db/types"
import { logger } from "../../utils/logger"
import db from "../../db"

interface PaginationProps {
  page: number
  limit: number
}

// Hard limit until we have pagination
const MAX_LIMIT = 1000

const getAllUsers = async ({ page, limit }: PaginationProps = { page: 0, limit: MAX_LIMIT }): Promise<SafeUser[]> => {
  try {
    const users: SafeUser[] = await db
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
      .limit(MAX_LIMIT)

    return users
  } catch (error) {
    logger.error("Service: getAllUsers: DB error getting all users")
    throw new Error("Error getting all users")
  }
}

export { getAllUsers }