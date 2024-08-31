import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { BadRequestError, NotFoundError } from "../../errors"
import SERVICES from "../../services"

/**
 * getUser
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  //
  const userId = req.params.id
  if (!userId) throw new BadRequestError("User ID is missing.")
  //
  const user = await SERVICES.getUserByID(userId)
  if (!user) throw new NotFoundError("User not found.")
  //
  return res.status(HTTP_SUCCESS.OK).json(user)
}

export default getUser
