import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { UserUpdate } from "../../db/types"
import { BadRequestError, ForbiddenError } from "../../errors"
import SERVICES from "../../services"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"

/**
 * updateUser
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const targetUserId = req[REQUEST_TARGET_USER_ID]
  //
  if (!id || !targetUserId) throw new BadRequestError("User ID is missing in the request.")

  // Possibly redundant, as the RBAC middleware will have found the user
  // and only set the [REQUEST_TARGET_USER_ID] on the request if it's valid
  if (id !== targetUserId) throw new ForbiddenError("You are not allowed to update this user.")

  // TODO: This is a check that should be done way before even looking up the target user
  if (!req.body || Object.keys(req.body).length === 0) throw new BadRequestError("No udpate data provided.")

  const { username, firstName, lastName, email, password }: Partial<UserUpdate> = req.body ?? {}

  // Add user meta fields here too so they be updated in parallel from a single payload?
  const updatedUserId = await SERVICES.updateUser({ userId: id, username, firstName, lastName, email, password })

  return res.status(HTTP_SUCCESS.OK).json({ message: `User ${updatedUserId} updated successfully` })
}
