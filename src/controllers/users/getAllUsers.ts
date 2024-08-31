import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import SERVICES from "../../services"

/**
 * getAllUsers
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Add a WITHMETA flag to include the user meta data
  // TODO: Filtering / searching / pagination
  const users = await SERVICES.getAllUsers()
  return res.status(HTTP_SUCCESS.OK).json(users)
}

export default getAllUsers
