import { Response } from 'express'
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from '../../constants/http'
import { logger } from '../../utils/logger'
import errorHandler from './errorHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'
import {
  BadRequestError,
  ConflictError,
  DatabaseError,
  EmailError,
  ForbiddenError,
  InternalServerError,
  NotAcceptableError,
  NotFoundError,
  NotImplementedError,
  PasswordError,
  LoginError,
  PasswordStrengthError,
  RateLimitError,
  TokenError,
  UnauthorizedError,
  ValidationError,
} from '../../errors'

jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Middleware: errorHandler', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>
  const nextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const testErrorHandling = (
    ErrorClass: typeof BadRequestError,
    expectedStatus: number,
    expectedMessage: string
  ): void => {
    const error = new ErrorClass()
    errorHandler(error, mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: expectedMessage })
    expect(logger.error).toHaveBeenCalledWith(error.message)
  }

  it('handles BadRequestError', () => {
    testErrorHandling(BadRequestError, HTTP_CLIENT_ERROR.BAD_REQUEST, MESSAGES.BAD_REQUEST)
  })

  it('handles ConflictError', () => {
    testErrorHandling(ConflictError, HTTP_CLIENT_ERROR.CONFLICT, MESSAGES.CONFLICT_ERROR)
  })

  it('handles DatabaseError', () => {
    testErrorHandling(DatabaseError, HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR, MESSAGES.DATABASE_ERROR)
  })

  it('handles EmailError', () => {
    testErrorHandling(EmailError, HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY, MESSAGES.EMAIL_ERROR)
  })

  it('handles ForbiddenError', () => {
    testErrorHandling(ForbiddenError, HTTP_CLIENT_ERROR.FORBIDDEN, MESSAGES.ACCESS_DENIED)
  })

  it('handles InternalServerError', () => {
    testErrorHandling(InternalServerError, HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR, MESSAGES.INTERNAL_SERVER_ERROR)
  })

  it('handles NotAcceptableError', () => {
    testErrorHandling(NotAcceptableError, HTTP_CLIENT_ERROR.NOT_ACCEPTABLE, MESSAGES.NOT_ACCEPTABLE)
  })

  it('handles NotFoundError', () => {
    testErrorHandling(NotFoundError, HTTP_CLIENT_ERROR.NOT_FOUND, MESSAGES.NOT_FOUND)
  })

  it('handles NotImplementedError', () => {
    testErrorHandling(NotImplementedError, HTTP_SERVER_ERROR.NOT_IMPLEMENTED, MESSAGES.FEATURE_NOT_IMPLEMENTED)
  })

  it('handles PasswordError', () => {
    testErrorHandling(PasswordError, HTTP_CLIENT_ERROR.FORBIDDEN, MESSAGES.ACCESS_DENIED)
  })

  it('handles LoginError', () => {
    testErrorHandling(LoginError, HTTP_CLIENT_ERROR.FORBIDDEN, MESSAGES.ACCESS_DENIED)
  })

  it('handles PasswordStrengthError', () => {
    testErrorHandling(PasswordStrengthError, HTTP_CLIENT_ERROR.BAD_REQUEST, MESSAGES.WEAK_PASSWORD)
  })

  it('handles RateLimitError', () => {
    const error = new RateLimitError('Custom rate limit message')
    errorHandler(error, mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.TOO_MANY_REQUESTS)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Custom rate limit message' })
    expect(logger.error).toHaveBeenCalledWith(error.message)
  })

  it('handles TokenError', () => {
    testErrorHandling(TokenError, HTTP_CLIENT_ERROR.UNAUTHORIZED, MESSAGES.TOKEN_INVALID)
  })

  it('handles UnauthorizedError', () => {
    testErrorHandling(UnauthorizedError, HTTP_CLIENT_ERROR.UNAUTHORIZED, MESSAGES.UNAUTHORIZED)
  })

  it('handles ValidationError', () => {
    testErrorHandling(ValidationError, HTTP_CLIENT_ERROR.UNPROCESSABLE_ENTITY, MESSAGES.VALIDATION_FAILED)
  })

  it('handles unknown errors', () => {
    const error = new Error('Unknown error')
    errorHandler(error, mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.SOMETHING_WENT_WRONG })
    expect(logger.error).toHaveBeenCalledWith('Unknown error')
  })
})
