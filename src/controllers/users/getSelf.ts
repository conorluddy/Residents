import { NextFunction, Request, Response } from "express"
import { REQUEST_USER } from "../../types/requestSymbols"
import SERVICES from "../../services"
import { BadRequestError, NotFoundError } from "../../errors"
import { handleSuccessResponse } from "../../middleware/util/successHandler"

/**
 * getSelf - gets own user record
 */
export const getSelf = async (req: Request, res: Response, next: NextFunction) => {
  //
  const userId = req[REQUEST_USER]?.id
  if (!userId) throw new BadRequestError("User ID is missing.")
  //
  const user = await SERVICES.getUserById(userId)
  if (!user) throw new NotFoundError("User not found.")
  //
  return handleSuccessResponse({ res, user })
}

export default getSelf
