import { Request, Response, NextFunction } from 'express'
import validateUserMeta from './validateUserMeta'

describe('Middleware: validateUserMeta', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: undefined,
    } as Request
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if the request body is missing', async () => {
    await expect(validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      'Invalid data provided.'
    )
  })

  it('should return 400 if the request body is null', async () => {
    mockRequest.body = null
    await expect(validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      'Invalid data provided.'
    )
  })

  it('should return 400 if the request body is invalid', async () => {
    mockRequest.body = { randomProperty: 'randomValue' }
    await expect(validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      'Invalid data provided.'
    )
  })

  it('should call next function if the request token is valid', () => {
    mockRequest.body = {
      metaItem: 'metaItem',
    }
    validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
