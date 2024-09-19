import { Request, Response } from 'express'
import { createId } from '@paralleldrive/cuid2'
import validateTokenId from './validateTokenId'
import MESSAGES from '../../constants/messages'

describe('Middleware: validateTokenId', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const mockNext = jest.fn().mockReturnThis()

  beforeEach(() => {
    mockRequest = { body: { tokenId: null } } as Request
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if the request token is missing', async () => {
    await expect(validateTokenId(mockRequest as Request, mockResponse as Response, mockNext)).rejects.toThrow(
      MESSAGES.TOKEN_REQUIRED
    )
  })

  it('should return 400 if the request token is invalid', async () => {
    mockRequest.body.tokenId = 'invalid_token'
    await expect(validateTokenId(mockRequest as Request, mockResponse as Response, mockNext)).rejects.toThrow(
      'Invalid token provided.'
    )
  })

  it('should call next function if the request token is valid', async () => {
    mockRequest.body.tokenId = createId()
    await validateTokenId(mockRequest as Request, mockResponse as Response, mockNext)
    expect(mockNext).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
