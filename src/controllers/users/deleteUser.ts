import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { STATUS } from "../../constants/database"

/**
 * deleteUser
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { targetUserId } = req // Note, This gets added to the req by getTargetUserAndCheckSuperiority MW

    if (!id || !targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "ID is missing in the request." })
    }

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the targetUserId on the request object, so we
    // can double check it here for additionaly security.

    if (id !== targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "You are not allowed to delete this user." })
    }

    const deletedUsers = await db
      .update(tableUsers)
      .set({ status: STATUS.DELETED, deletedAt: new Date() })
      .where(eq(tableUsers.id, id))
      .returning({ deletedUserId: tableUsers.id })

    return res.status(HTTP_SUCCESS.OK).json({ message: `User ${deletedUsers[0]?.deletedUserId} deleted` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error deleting user" })
  }
}
