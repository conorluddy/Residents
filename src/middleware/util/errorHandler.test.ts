import { Request, Response } from 'express'
import { HTTP_SERVER_ERROR } from '../../constants/http'
import { logger } from '../../utils/logger'
import errorHandler from './errorHandler'
import MESSAGES from '../../constants/messages'

jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Middleware: errorHandler', () => {
  let mockErr: Error
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction = jest.fn()

  beforeEach(() => {
    mockErr = new Error('Test error')
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Send the correct error response and logs the error', async () => {
    await errorHandler(mockErr, mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.SOMETHING_WENT_WRONG })
    expect(logger.error).toHaveBeenCalledWith('Test error')
  })
})
