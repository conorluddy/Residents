import { NextFunction, Request, RequestHandler, Response } from "express"
import { isEmail } from "validator"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"

const validateRequestEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email: string | undefined = req.params?.email || req.body?.email || req.query?.email

    if (!email) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json("Email is required")
    }

    if (!isEmail(email)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json("Invalid email address")
    }

    req.validatedEmail = email
    next()
  } catch (error) {
    logger.error("Posted email addresss was invalid", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json("Invalid email address")
  }
}

export default validateRequestEmail
