import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { Meta } from "../../db/types"
import SERVICES from "../../services"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

/**
 * updateUserMeta
 */
export const updateUserMeta = async (req: Request, res: Response) => {
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

    // Add the rest of the user meta fields.
    // Sanitise and validate the data (ideally in a middleware before we ever get to this controller)
    const { metaItem }: Partial<Meta> = req.body ?? {}

    const updatedUserId = await SERVICES.updateUserMeta({ userId: id, metaItem })

    return res.status(HTTP_SUCCESS.OK).json({ message: `User meta for ${updatedUserId} updated successfully` })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error updating user metadata" })
  }
}
