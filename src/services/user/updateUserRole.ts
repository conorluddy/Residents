import db from "../../db"
import { eq } from "drizzle-orm"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"
import { ROLES, ROLES_ARRAY } from "../../constants/database"

interface Params {
  userId: string
  role: ROLES
}

const updateUserRole = async ({ userId, role }: Params): Promise<string> => {
  if (!userId) throw new Error("User ID must be provided.")
  if (!role) throw new Error("Role must be provided.")
  if (!ROLES_ARRAY.includes(role)) throw new Error("Invalid role provided.")

  try {
    const [{ updatedUserId }] = await db
      .update(tableUsers)
      .set({ role })
      .where(eq(tableUsers.id, userId))
      .returning({ updatedUserId: tableUsers.id })

    return updatedUserId
  } catch (error) {
    logger.error("Error updating user role:", userId, error)
    throw new Error("Error updating user role.")
  }
}

export { updateUserRole }
