import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers } from "../../db/schema"

/**
 * updateUser
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { targetUserId } = req
    const { username, firstName, lastName, email } = req.body

    if (!id) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("User ID is missing in the request.")
    }

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the targetUserId on the request object, so we
    // can double check it here for additionaly security.
    if (id !== targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("You are not allowed to update this user.")
    }

    const updateFields: Record<string, string> = {}
    if (username) updateFields.username = username
    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (email) updateFields.email = email

    const result = await db
      .update(tableUsers)
      .set(updateFields)
      .where(eq(tableUsers.id, id))
      .returning({ updatedId: tableUsers.id })

    if (result.length === 0) {
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).send("User not found.")
    }

    return res.status(HTTP_SUCCESS.OK).json({ message: `User ${result[0].updatedId} updated successfully` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error updating user")
  }
}
