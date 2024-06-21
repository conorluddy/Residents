import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"

/**
 * requestPasswordReset
 * POST
 */
export const requestPasswordReset = async (
  { body }: Request,
  res: Response
) => {
  try {
    res.status(HTTP_SUCCESS.OK).send("Ok")
  } catch (error) {
    logger.error(error)
    res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .send("Error registering user")
  }
}
