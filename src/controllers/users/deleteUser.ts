import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { BadRequestError, ForbiddenError } from "../../errors"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"
import SERVICES from "../../services"

/**
 * deleteUser
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  // The param ID is the ID of the user to be deleted from the URL
  const { id } = req.params
  // The targetUserId is the same ID of the user to be deleted, but will
  // only exist on the request if it has been validated by the middleware
  // getTargetUserAndCheckSuperiority fn
  const targetUserId = req[REQUEST_TARGET_USER_ID]

  if (!id || !targetUserId) throw new BadRequestError("User ID is missing.")
  if (id !== targetUserId) throw new ForbiddenError("ID mismatch, can not delete.")

  const deletedUserId = await SERVICES.deleteUser({ userId: id })

  return res.status(HTTP_SUCCESS.OK).json({ message: `User ${deletedUserId} deleted` })
}
