import { eq } from "drizzle-orm"
import { STATUS } from "../../constants/database"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"
import { DatabaseError } from "../../errors"

interface Params {
  userId: string
}

const deleteUser = async ({ userId }: Params): Promise<string> => {
  try {
    if (!userId) throw new Error("User ID must be provided.")

    const [{ updatedUserId }] = await db
      .update(tableUsers)
      .set({ deletedAt: new Date(), status: STATUS.DELETED })
      .where(eq(tableUsers.id, userId))
      .returning({ updatedUserId: tableUsers.id })

    return updatedUserId
  } catch (error) {
    logger.error("Error deleting user:", userId, error)
    throw new DatabaseError("Error deleting user.")
  }
}

export { deleteUser }
