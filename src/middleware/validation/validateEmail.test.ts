import { Response, NextFunction } from 'express'
import validateEmail from './validateEmail'
import MESSAGES from '../../constants/messages'
import { BadRequestError } from '../../errors'
import { ResidentRequest } from '../../types'

describe('Middleware: validateEmail', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {
        email: null,
      },
    } as ResidentRequest

    mockResponse = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>

    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if the request email is missing', () => {
    expect(() => {
      validateEmail(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    }).toThrow(new BadRequestError(MESSAGES.EMAIL_REQUIRED))
    expect(nextFunction).not.toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })

  it('should return 400 if the request email is invalid', () => {
    mockRequest.body.email = 'thatsnotanemail'
    expect(() => {
      validateEmail(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    }).toThrow(new BadRequestError(MESSAGES.INVALID_EMAIL))
    expect(nextFunction).not.toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })

  it('should call next function if email is valid', async () => {
    mockRequest.body.email = 'thats@anemail.com'
    await validateEmail(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
