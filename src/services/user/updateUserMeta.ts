import db from "../../db"
import { eq } from "drizzle-orm"
import { tableUserMeta, tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"

interface Params {
  userId: string
  metaItem?: string | null // Example property - customise these properties to your needs
}

const updateUserMeta = async ({ userId, metaItem }: Params): Promise<string> => {
  try {
    if (!userId) throw new Error("User ID must be provided.")
    if (!metaItem) throw new Error("No meta data provided to update.")

    const [updatedMeta] = await db
      .update(tableUserMeta)
      .set({ metaItem })
      .where(eq(tableUserMeta.userId, userId))
      .returning()

    return updatedMeta.userId
  } catch (error) {
    logger.error("Error updating user meta:", userId, error)
    throw new Error("Error updating user meta.")
  }
}

export { updateUserMeta }
