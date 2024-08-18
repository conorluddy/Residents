import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import SERVICES from "../../services"

/**
 * getAllUsers - This will need pagination and filtering/searching
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Add a WITHMETA flag to include the user meta data
    const users = await SERVICES.getAllUsers()
    return res.status(HTTP_SUCCESS.OK).json(users)
  } catch (error) {
    logger.error("Controller: getAllUsers: Error: ", error)
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error getting users." })
  }
}

export default getAllUsers
