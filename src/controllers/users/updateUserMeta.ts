import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUserMeta, tableUsers } from "../../db/schema"
import { isEmail, normalizeEmail } from "validator"
import { Meta } from "../../db/types"

/**
 * updateUserMeta
 */
export const updateUserMeta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { targetUserId } = req

    if (!id || !targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "User ID is missing in the request." })
    }

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the targetUserId on the request object, so we
    // can double check it here for additionaly security.
    if (id !== targetUserId) {
      logger.error(`ID in params doesnt match targetUserId in request.`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "You are not allowed to update this user." })
    }

    // This is another check that should be done before even looking up the target user
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.error(`Missing body data for updating user in request.`)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "No data provided to update the user with." })
    }

    const { metaItem }: Partial<Meta> = req.body ?? {}

    const updateFields: Partial<Meta> = { metaItem }

    // Add the rest of the user meta fields.
    // Sanitise and validate the data (ideally in a middleware before we ever get to this controller)
    if (metaItem) updateFields.metaItem = metaItem

    if (Object.values(updateFields).length === 0) {
      return res
        .status(HTTP_CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "No valid fields were passed for updating the user meta." })
    }

    const [result] = await db
      .update(tableUserMeta)
      .set(updateFields)
      .where(eq(tableUserMeta.userId, id))
      .returning({ updatedId: tableUsers.id })

    if (!result) {
      // The metadata table is created when a user is created, but we could do an upsert here just in case.
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "User meta data not found." })
    }

    return res.status(HTTP_SUCCESS.OK).json({ message: `User meta for ${result.updatedId} updated successfully` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating user metadata" })
  }
}
