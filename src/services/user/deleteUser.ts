import { eq } from "drizzle-orm"
import { STATUS } from "../../constants/database"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { PasswordError } from "../../utils/errors"
import { logger } from "../../utils/logger"

interface Params {
  userId: string
}

const deleteUser = async ({ userId }: Params): Promise<string> => {
  if (!userId) throw new Error("User ID must be provided.")

  try {
    const [{ updatedUserId }] = await db
      .update(tableUsers)
      .set({ deletedAt: new Date(), status: STATUS.DELETED })
      .where(eq(tableUsers.id, userId))
      .returning({ updatedUserId: tableUsers.id })

    return updatedUserId
  } catch (error) {
    logger.error("Error deleting user:", userId, error)
    throw new PasswordError("Error deleting user.")
  }
}

export { deleteUser }
