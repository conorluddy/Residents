import { NextFunction, Request, Response, ErrorRequestHandler } from 'express'
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
import MESSAGES from '../../constants/messages'

const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  if (!err) {
    next()
    return
  }

  logger.error(err.message)

  if (err instanceof BadRequestError) {
    res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: MESSAGES.BAD_REQUEST })
    return
  }
  if (err instanceof ConflictError) {
    res.status(HTTP_CLIENT_ERROR.CONFLICT).json({ message: MESSAGES.CONFLICT_ERROR })
    return
  }
  if (err instanceof DatabaseError) {
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.DATABASE_ERROR })
    return
  }
  if (err instanceof EmailError) {
    res.status(HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY).json({ message: MESSAGES.EMAIL_ERROR })
    return
  }
  if (err instanceof ForbiddenError) {
    res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED })
    return
  }
  if (err instanceof InternalServerError) {
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.INTERNAL_SERVER_ERROR })
    return
  }
  if (err instanceof NotAcceptableError) {
    res.status(HTTP_CLIENT_ERROR.NOT_ACCEPTABLE).json({ message: MESSAGES.NOT_ACCEPTABLE })
    return
  }
  if (err instanceof NotFoundError) {
    res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: MESSAGES.NOT_FOUND })
    return
  }
  if (err instanceof NotImplementedError) {
    res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: MESSAGES.FEATURE_NOT_IMPLEMENTED })
    return
  }
  if (err instanceof PasswordError) {
    res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED })
    return
  }
  if (err instanceof LoginError) {
    res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: MESSAGES.ACCESS_DENIED })
    return
  }
  if (err instanceof PasswordStrengthError) {
    res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: MESSAGES.WEAK_PASSWORD })
    return
  }
  if (err instanceof RateLimitError) {
    res.status(HTTP_CLIENT_ERROR.TOO_MANY_REQUESTS).json({ message: err.message || MESSAGES.TOO_MANY_REQUESTS })
    return
  }
  if (err instanceof TokenError) {
    res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_INVALID })
    return
  }
  if (err instanceof UnauthorizedError) {
    res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED })
    return
  }
  if (err instanceof ValidationError) {
    res.status(HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY).json({ message: MESSAGES.VALIDATION_FAILED })
    return
  }

  res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SOMETHING_WENT_WRONG })
}

export default errorHandler
