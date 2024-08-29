import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import SERVICES from "../../services"
import { BadRequestError } from "../../errors"

/**
 * getSelf - gets own user record
 */
export const getSelf = async (req: Request, res: Response) => {
  try {
    const userId = req[REQUEST_USER]?.id

    if (!userId) throw new BadRequestError("User ID mismatch.")

    const user = await SERVICES.getUserByID(userId)

    if (!user) return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "User not found." })

    return res.status(HTTP_SUCCESS.OK).json(user)
  } catch (error) {
    logger.error(error)
    return res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error while getting user." })
  }
}

export default getSelf
