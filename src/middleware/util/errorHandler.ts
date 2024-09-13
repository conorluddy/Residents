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
  ConflictError,
  DatabaseError,
  EmailError,
  InternalServerError,
  NotAcceptableError,
  PasswordError,
  RateLimitError,
  TokenError,
  ValidationError,
} from "../../errors"

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (!err) next()

  // console.log("ERRRRR", err.message)

  logger.error(err.message)

  // Debug
  // if (process.env.NODE_ENV === "test") console.log(err.message)

  if (err instanceof BadRequestError) {
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Bad request." })
  }
  if (err instanceof ConflictError) {
    return res.status(HTTP_CLIENT_ERROR.CONFLICT).json({ message: "Conflict error." })
  }
  if (err instanceof DatabaseError) {
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Database error." })
  }
  if (err instanceof EmailError) {
    return res.status(HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY).json({ message: "Email processing error." })
  }
  if (err instanceof ForbiddenError) {
    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Access denied." })
  }
  if (err instanceof InternalServerError) {
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Internal server error." })
  }
  if (err instanceof NotAcceptableError) {
    return res.status(HTTP_CLIENT_ERROR.NOT_ACCEPTABLE).json({ message: "Request not acceptable." })
  }
  if (err instanceof NotFoundError) {
    return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Resource not found." })
  }
  if (err instanceof NotImplementedError) {
    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: "Feature not implemented." })
  }
  if (err instanceof PasswordError) {
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password error." })
  }
  if (err instanceof PasswordStrengthError) {
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password strength insufficient." })
  }
  if (err instanceof RateLimitError) {
    return res.status(HTTP_CLIENT_ERROR.TOO_MANY_REQUESTS).json({ message: "Too many requests, slow down!" })
  }
  if (err instanceof TokenError) {
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Invalid or expired token." })
  }
  if (err instanceof UnauthorizedError) {
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Unauthorized access." })
  }
  if (err instanceof ValidationError) {
    return res.status(HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY).json({ message: "Validation failed." })
  }

  res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Something went kaput..." })

  next(err)
}

export default errorHandler
