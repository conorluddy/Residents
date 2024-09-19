import { NextFunction, Request, Response } from 'express'
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from '../../constants/http'
import { logger } from '../../utils/logger'
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
  LoginError,
} from '../../errors'

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    next()
  }

  logger.error(err.message)

  if (err instanceof BadRequestError) {
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: MESSAGES.BAD_REQUEST })
  }
  if (err instanceof ConflictError) {
    return res.status(HTTP_CLIENT_ERROR.CONFLICT).json({ message: MESSAGES.CONFLICT_ERROR })
  }
  if (err instanceof DatabaseError) {
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.DATABASE_ERROR })
  }
  if (err instanceof EmailError) {
    return res.status(HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY).json({ message: MESSAGES.EMAIL_ERROR })
  }
  if (err instanceof ForbiddenError) {
    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED })
  }
  if (err instanceof InternalServerError) {
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.INTERNAL_SERVER_ERROR })
  }
  if (err instanceof NotAcceptableError) {
    return res.status(HTTP_CLIENT_ERROR.NOT_ACCEPTABLE).json({ message: 'Request not acceptable.' })
  }
  if (err instanceof NotFoundError) {
    return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: MESSAGES.NOT_FOUND })
  }
  if (err instanceof NotImplementedError) {
    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: MESSAGES.FEATURE_NOT_IMPLEMENTED })
  }
  if (err instanceof PasswordError) {
    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED })
  }
  // Don't disclose any user/pw information about the error to the client.
  if (err instanceof LoginError) {
    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED })
  }
  if (err instanceof PasswordStrengthError) {
    return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: 'Password strength insufficient.' })
  }
  if (err instanceof RateLimitError) {
    return res
      .status(HTTP_CLIENT_ERROR.TOO_MANY_REQUESTS)
      .json({ message: err.message ? err.message : 'Too many requests, slow down!' })
  }
  if (err instanceof TokenError) {
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: 'Invalid or expired token.' })
  }
  if (err instanceof UnauthorizedError) {
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED })
  }
  if (err instanceof ValidationError) {
    return res.status(HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY).json({ message: MESSAGES.VALIDATION_FAILED })
  }

  res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: 'Something went kaput...' })

  next(err)
}

export default errorHandler
