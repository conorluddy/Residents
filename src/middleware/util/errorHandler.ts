import { NextFunction, Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotImplementedError,
  PasswordStrengthError,
} from "../../errors"

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (!err) next()

  logger.error(err.message)

  if (err instanceof BadRequestError) {
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Bad payload." })
  }
  if (err instanceof UnauthorizedError) {
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Unauthorized." })
  }
  if (err instanceof ForbiddenError) {
    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Forbidden." })
  }
  if (err instanceof NotFoundError) {
    return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Not found." })
  }
  if (err instanceof NotImplementedError) {
    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: "Not implemented, yet..." })
  }
  if (err instanceof PasswordStrengthError) {
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password not strong enough." })
  }

  // Default to InternalServerError for other unhandled cases
  res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Something went kaput..." })
  next(err)
}

export default errorHandler
