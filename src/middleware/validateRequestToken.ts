import { NextFunction, Request, RequestHandler, Response } from "express"

import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"
import { isCuid } from "@paralleldrive/cuid2"

const validateRequestToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token || req.body.token || req.query.token

    if (!token) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("A token is required")
    }

    if (!isCuid(token)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Invalid token provided")
    }

    req.validatedToken = token
    next()
  } catch (error) {
    logger.error("Token was invalid", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error validating token")
  }
}

export default validateRequestToken
