import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers, User } from "../../db/schema"
import { isEmail, normalizeEmail } from "validator"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"

/**
 * updateUser
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const targetUserId = req[REQUEST_TARGET_USER_ID]

    if (!id || !targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "User ID is missing in the request." })
    }

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the [REQUEST_TARGET_USER_ID] on the request object, so we
    // can double check it here for additionaly security.
    if (id !== targetUserId) {
      logger.error(`ID in params doesnt match [REQUEST_TARGET_USER_ID] in request.`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "You are not allowed to update this user." })
    }

    // This is another check that should be done before even looking up the target user
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.error(`Missing body data for updating user in request.`)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "No data provided to update the user with." })
    }

    const { username, firstName, lastName, email }: Partial<User> = req.body ?? {}
    const updateFields: Record<string, string | false> = {}

    if (email && !isEmail(email)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({
        message: `You need to use a valid email address if you want to update an email. ${email} is not valid.`,
      })
    }

    if (username) updateFields.username = username
    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (email) updateFields.email = normalizeEmail(email, { all_lowercase: true })

    // Add the rest of the user fields and check the password strength
    // if (password) updateFields.password = password

    // Add user meta fields here too so they be updated in parallel from a single payload

    // Bit smelly here, normalizeEmail returns false if there's a problem.
    if (updateFields.email === false) throw new Error(`Problem with email normalization for ${email}`)

    const result = await db
      .update(tableUsers)
      .set(updateFields)
      .where(eq(tableUsers.id, id))
      .returning({ updatedId: tableUsers.id })

    if (result.length === 0) {
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "User not found." })
    }

    return res.status(HTTP_SUCCESS.OK).json({ message: `User ${result[0].updatedId} updated successfully` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating user" })
  }
}
