import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { isCuid } from "@paralleldrive/cuid2"

const validateToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatePayload = req.body

    // Check that the body keys match the acceptable UserMeta keys

    next()
  } catch (error) {
    logger.error("Request validation error: ", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Invalid request" })
  }
}

export default validateToken
