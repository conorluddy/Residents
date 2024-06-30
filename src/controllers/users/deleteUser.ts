import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { STATUS } from "../../constants/user"

/**
 * deleteUser
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { targetUserId } = req

    if (!id) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("ID is missing in the request.")
    }

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the targetUserId on the request object, so we
    // can double check it here for additionaly security.
    if (id !== targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("You are not allowed to delete this user.")
    }

    const result = await db
      .update(tableUsers)
      .set({ status: STATUS.DELETED, deletedAt: new Date() })
      .where(eq(tableUsers.id, id))
      .returning({ updatedId: tableUsers.id })

    return res.status(HTTP_SUCCESS.OK).json({ message: `User ${result[0].updatedId} deleted` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error getting users")
  }
}
