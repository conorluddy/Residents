import { NextFunction, Request, RequestHandler, Response } from "express"
import { isEmail } from "validator"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"

const validateRequestEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params || req.body || req.query || {}

    if (!email) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Email is required")
    }

    if (!isEmail(email)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Invalid email address")
    }

    req.validatedEmail = email
    next()
  } catch (error) {
    logger.error("Posted email addresss was invalid", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Invalid email address")
  }
}

export default validateRequestEmail
