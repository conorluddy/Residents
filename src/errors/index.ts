import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from '../constants/http'
import MESSAGES from '../constants/messages'

type ClientErrorCodes = (typeof HTTP_CLIENT_ERROR)[keyof typeof HTTP_CLIENT_ERROR]
type ServerErrorCodes = (typeof HTTP_SERVER_ERROR)[keyof typeof HTTP_SERVER_ERROR]

// TODO: Migrate these here from /src/utils/errors.ts

class PasswordStrengthError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.WEAK_PASSWORD) {
    super(message)
    this.name = 'PasswordStrengthError'
    this.statusCode = HTTP_CLIENT_ERROR.BAD_REQUEST
    Object.setPrototypeOf(this, PasswordStrengthError.prototype)
  }
}

class BadRequestError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.BAD_REQUEST) {
    super(message)
    this.name = 'BadRequestError'
    this.statusCode = HTTP_CLIENT_ERROR.BAD_REQUEST
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

class UnauthorizedError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.UNAUTHORIZED) {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = HTTP_CLIENT_ERROR.UNAUTHORIZED
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

class ForbiddenError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
    this.statusCode = HTTP_CLIENT_ERROR.FORBIDDEN
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

class NotFoundError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.NOT_FOUND) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = HTTP_CLIENT_ERROR.NOT_FOUND
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

class InternalServerError extends Error {
  public statusCode: ServerErrorCodes
  constructor(message = MESSAGES.INTERNAL_SERVER_ERROR) {
    super(message)
    this.name = 'InternalServerError'
    this.statusCode = HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}

class NotImplementedError extends Error {
  public statusCode: ServerErrorCodes
  constructor(message = MESSAGES.FEATURE_NOT_IMPLEMENTED) {
    super(message)
    this.name = 'NotImplementedError'
    this.statusCode = HTTP_SERVER_ERROR.NOT_IMPLEMENTED
    Object.setPrototypeOf(this, NotImplementedError.prototype)
  }
}

class ValidationError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.VALIDATION_FAILED) {
    super(message)
    this.name = 'ValidationError'
    this.statusCode = HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

class EmailError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = 'Email Error') {
    super(message)
    this.name = 'EmailError'
    this.statusCode = HTTP_CLIENT_ERROR.BAD_REQUEST
    Object.setPrototypeOf(this, EmailError.prototype)
  }
}

class TokenError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.TOKEN_ERROR) {
    super(message)
    this.name = 'TokenError'
    this.statusCode = HTTP_CLIENT_ERROR.UNAUTHORIZED
    Object.setPrototypeOf(this, TokenError.prototype)
  }
}

class DatabaseError extends Error {
  public statusCode: ServerErrorCodes
  constructor(message = MESSAGES.DATABASE_ERROR) {
    super(message)
    this.name = 'DatabaseError'
    this.statusCode = HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}

class PasswordError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.PASSWORD_ERROR) {
    super(message)
    this.name = 'PasswordError'
    this.statusCode = HTTP_CLIENT_ERROR.BAD_REQUEST
    Object.setPrototypeOf(this, PasswordError.prototype)
  }
}

class ConflictError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.CONFLICT_ERROR) {
    super(message)
    this.name = 'ConflictError'
    this.statusCode = HTTP_CLIENT_ERROR.CONFLICT
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

class NotAcceptableError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.NOT_ACCEPTABLE) {
    super(message)
    this.name = 'NotAcceptableError'
    this.statusCode = HTTP_CLIENT_ERROR.NOT_ACCEPTABLE
    Object.setPrototypeOf(this, NotAcceptableError.prototype)
  }
}

class RateLimitError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.TOO_MANY_REQUESTS) {
    super(message)
    this.name = 'RateLimitError'
    this.statusCode = HTTP_CLIENT_ERROR.TOO_MANY_REQUESTS
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

class LoginError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = MESSAGES.ERROR_LOGGING_IN) {
    super(message)
    this.name = 'LoginError'
    this.statusCode = HTTP_CLIENT_ERROR.UNAUTHORIZED
    Object.setPrototypeOf(this, LoginError.prototype)
  }
}

export {
  BadRequestError,
  ConflictError,
  DatabaseError,
  EmailError,
  ForbiddenError,
  InternalServerError,
  LoginError,
  NotAcceptableError,
  NotFoundError,
  NotImplementedError,
  PasswordError,
  PasswordStrengthError,
  RateLimitError,
  TokenError,
  UnauthorizedError,
  ValidationError,
}
