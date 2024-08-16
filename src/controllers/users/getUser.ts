import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { getUserByID } from "../../services/user/getUser"
import { logger } from "../../utils/logger"

/**
 * getUser
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id

    if (!userId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "ID is missing in the request." })
    }

    const user = await getUserByID(userId)

    if (!user) {
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "User not found." })
    }

    return res.status(HTTP_SUCCESS.OK).json(user)
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error getting user." })
  }
}

export default getUser
