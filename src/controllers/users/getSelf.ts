import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { REQUEST_USER } from "../../types/requestSymbols"
import SERVICES from "../../services"
import { BadRequestError, NotFoundError } from "../../errors"

/**
 * getSelf - gets own user record
 */
export const getSelf = async (req: Request, res: Response, next: NextFunction) => {
  //
  const userId = req[REQUEST_USER]?.id
  if (!userId) throw new BadRequestError("User ID is missing.")
  //
  const user = await SERVICES.getUserByID(userId)
  if (!user) throw new NotFoundError("User not found.")
  //
  return res.status(HTTP_SUCCESS.OK).json(user)
}

export default getSelf
