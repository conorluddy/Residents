import db from "../../db"
import { eq } from "drizzle-orm"
import { tableUserMeta } from "../../db/schema"
import { BadRequestError } from "../../errors"

interface Params {
  userId: string
  metaItem?: string | null // Example property - customise these properties to your needs
}

const updateUserMeta = async ({ userId, metaItem }: Params): Promise<string> => {
  if (!userId) throw new BadRequestError("User ID must be provided.")
  if (!metaItem) throw new BadRequestError("No meta data provided to update.")

  const [updatedMeta] = await db
    .update(tableUserMeta)
    .set({ metaItem })
    .where(eq(tableUserMeta.userId, userId))
    .returning()

  return updatedMeta.userId
}

export { updateUserMeta }
