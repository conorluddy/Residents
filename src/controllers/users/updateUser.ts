import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers, User } from "../../db/schema"
import { isEmail, normalizeEmail } from "validator"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"
import SERVICES from "../../services"
import { UserUpdate } from "../../db/types"

/**
 * updateUser
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const targetUserId = req[REQUEST_TARGET_USER_ID]

    if (!id || !targetUserId)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "User ID is missing in the request." })

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the [REQUEST_TARGET_USER_ID] on the request object, so we
    // can double check it here for additionaly security.
    if (id !== targetUserId)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "You are not allowed to update this user." })

    // This is another check that should be done before even looking up the target user
    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "No data provided to update the user with." })

    const { username, firstName, lastName, email, password }: Partial<UserUpdate> = req.body ?? {}

    // Add user meta fields here too so they be updated in parallel from a single payload

    const updatedUserId = await SERVICES.updateUser({ userId: id, username, firstName, lastName, email, password })

    return res.status(HTTP_SUCCESS.OK).json({ message: `User ${updatedUserId} updated successfully` })
  } catch (error) {
    logger.error(error)

    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating user" })
  }
}
