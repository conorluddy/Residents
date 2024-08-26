import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import SERVICES from "../../services"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

/**
 * deleteUser
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const targetUserId = req[REQUEST_TARGET_USER_ID] // Note, This gets added to the req by getTargetUserAndCheckSuperiority MW

    if (!id || !targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "ID is missing in the request." })
    }

    // Possibly redundant, but the RBAC middleware will have found
    // the user and set the [REQUEST_TARGET_USER_ID] on the request object, so we
    // can double check it here for additionaly security.

    if (id !== targetUserId) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "You are not allowed to delete this user." })
    }

    const deletedUserId = await SERVICES.deleteUser({ userId: id })

    return res.status(HTTP_SUCCESS.OK).json({ message: `User ${deletedUserId} deleted` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error deleting user" })
  }
}
