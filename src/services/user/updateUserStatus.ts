import db from "../../db"
import { eq } from "drizzle-orm"
import { STATUS, STATUS_ARRAY } from "../../constants/database"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"

interface Params {
  userId: string
  status: STATUS
}

const updateUserStatus = async ({ userId, status }: Params): Promise<string> => {
  if (!userId) throw new Error("User ID must be provided.")
  if (!status) throw new Error("Status must be provided.")
  if (!STATUS_ARRAY.includes(status)) throw new Error("Invalid status provided.")

  try {
    const [{ updatedUserId }] = await db
      .update(tableUsers)
      .set({ status })
      .where(eq(tableUsers.id, userId))
      .returning({ updatedUserId: tableUsers.id })

    return updatedUserId
  } catch (error) {
    logger.error("Error updating user status:", userId, error)
    throw new Error("Error updating user status.")
  }
}

export { updateUserStatus }
