import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"

type ClientErrorCodes = (typeof HTTP_CLIENT_ERROR)[keyof typeof HTTP_CLIENT_ERROR]
type ServerErrorCodes = (typeof HTTP_SERVER_ERROR)[keyof typeof HTTP_SERVER_ERROR]

class BadRequestError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = "Bad Request") {
    super(message)
    this.name = "BadRequestError"
    this.statusCode = HTTP_CLIENT_ERROR.BAD_REQUEST
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

class UnauthorizedError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = "Unauthorized") {
    super(message)
    this.name = "UnauthorizedError"
    this.statusCode = HTTP_CLIENT_ERROR.UNAUTHORIZED
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

class ForbiddenError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = "Forbidden") {
    super(message)
    this.name = "ForbiddenError"
    this.statusCode = HTTP_CLIENT_ERROR.FORBIDDEN
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

class NotFoundError extends Error {
  public statusCode: ClientErrorCodes
  constructor(message = "Not Found") {
    super(message)
    this.name = "NotFoundError"
    this.statusCode = HTTP_CLIENT_ERROR.NOT_FOUND
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

class InternalServerError extends Error {
  public statusCode: ServerErrorCodes
  constructor(message = "Internal Server Error") {
    super(message)
    this.name = "InternalServerError"
    this.statusCode = HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}

class NotImplementedError extends Error {
  public statusCode: ServerErrorCodes
  constructor(message = "Not Implemented") {
    super(message)
    this.name = "NotImplementedError"
    this.statusCode = HTTP_SERVER_ERROR.NOT_IMPLEMENTED
    Object.setPrototypeOf(this, NotImplementedError.prototype)
  }
}

export { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, NotImplementedError }
