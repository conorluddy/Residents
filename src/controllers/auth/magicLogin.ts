import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"

/**
 * magicLogin
 * POST
 */
export const magicLogin = async (req: Request, res: Response) => {
  try {
    const { email }: Record<string, string> = req.body

    if (!email) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Email is required" })
    }

    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: "Not implemented yet" })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error with magic login" })
  }
}
