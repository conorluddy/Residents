import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { normalizeEmail } from "validator"

/**
 * updateUser
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { targetUserId } = req

    if (!id) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json("User ID is missing in the request.")
    }

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the targetUserId on the request object, so we
    // can double check it here for additionaly security.
    if (id !== targetUserId) {
      logger.error(`ID in params doesnt match targetUserId in request.`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json("You are not allowed to update this user.")
    }
    if (!req.body) {
      logger.error(`Missing body data for updating user in request.`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json("You are not allowed to update this user.")
    }

    const { username, firstName, lastName, email }: Record<string, string> = req.body ?? {}
    const updateFields: Record<string, string | false> = {}

    if (username) updateFields.username = username
    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (email) updateFields.email = normalizeEmail(email)

    // Add the rest of the user fields and check the password strength
    // if (password) updateFields.password = password

    // Bit smelly here, normalizeEmail returns false if there's a problem.
    if (updateFields.email === false) throw new Error(`Problem with email normalization for ${email}`)

    const result = await db
      .update(tableUsers)
      .set(updateFields)
      .where(eq(tableUsers.id, id))
      .returning({ updatedId: tableUsers.id })

    if (result.length === 0) {
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json("User not found.")
    }

    return res.status(HTTP_SUCCESS.OK).json({ message: `User ${result[0].updatedId} updated successfully` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json("Error updating user")
  }
}
