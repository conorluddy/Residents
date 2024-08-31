import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { Meta } from "../../db/types"
import { BadRequestError } from "../../errors"
import SERVICES from "../../services"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"

/**
 * updateUserMeta
 */
export const updateUserMeta = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const targetUserId = req[REQUEST_TARGET_USER_ID]

  if (!id || !targetUserId) throw new BadRequestError("User ID is missing in the request.")

  if (id !== targetUserId) throw new BadRequestError("You are not allowed to update this user.")

  if (!req.body || Object.keys(req.body).length === 0) throw new BadRequestError("No udpate data provided.")

  // Add the rest of the user meta fields.
  // Sanitise and validate the data (ideally in a middleware before we ever get to this controller)
  const { metaItem }: Partial<Meta> = req.body ?? {}

  const updatedUserId = await SERVICES.updateUserMeta({ userId: id, metaItem })

  return res.status(HTTP_SUCCESS.OK).json({ message: `User meta for ${updatedUserId} updated successfully` })
}
