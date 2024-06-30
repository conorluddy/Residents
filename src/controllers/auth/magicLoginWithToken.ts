import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"

/**
 * magicWithToken
 * GET
 */
export const magicLoginWithToken = async ({ body }: Request, res: Response) => {
  try {
    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).send("Not implemented yet")
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error registering user")
  }
}
