import { Response, NextFunction } from 'express'
import validateUserMeta from './validateUserMeta'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

describe('Middleware: validateUserMeta', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: undefined,
    } as ResidentRequest
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if the request body is missing', () => {
    expect(() => validateUserMeta(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)).toThrow(
      new BadRequestError(MESSAGES.INVALID_DATA_PROVIDED)
    )
  })

  it('should return 400 if the request body is null', () => {
    mockRequest.body = null
    expect(() => validateUserMeta(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)).toThrow(
      new BadRequestError(MESSAGES.INVALID_DATA_PROVIDED)
    )
  })

  it('should return 400 if the request body is invalid', () => {
    mockRequest.body = { randomProperty: 'randomValue' }
    expect(() => validateUserMeta(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)).toThrow(
      new BadRequestError(MESSAGES.INVALID_DATA_PROVIDED)
    )
  })

  it('should call next function if the request token is valid', () => {
    mockRequest.body = {
      metaItem: 'metaItem',
    }
    validateUserMeta(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
