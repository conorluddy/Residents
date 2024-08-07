import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"

/**
 * GET: magicLoginWithToken
 */
export const magicLoginWithToken = async (_req: Request, res: Response) => {
  try {
    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: "Not implemented yet" })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" })
  }
}
