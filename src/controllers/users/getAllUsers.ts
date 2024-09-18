import { NextFunction, Request, Response } from "express"
import SERVICES from "../../services"
import { handleSuccessResponse } from "../../middleware/util/successHandler"

/**
 * getAllUsers
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Add a WITHMETA flag to include the user meta data
  // TODO: Filtering / searching / pagination
  const users = await SERVICES.getAllUsers()
  return handleSuccessResponse({ res, users })
}

export default getAllUsers
