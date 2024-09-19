import { NextFunction, Request, Response } from 'express'
import { ROLES } from '../../constants/database'
import xsrfTokens from './xsrfTokens'
import { UnauthorizedError } from '../../errors'

describe('Middleware: XSRF Tokens: ', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let originalEnv: string | undefined

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV

    mockRequest = {
      user: { role: ROLES.ADMIN, id: 'AdminTestUser1' },
      headers: {
        'xsrf-token': '123',
      },
      cookies: {
        xsrfToken: '123',
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('Returns early in test environment', () => {
    xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it('Returns early if request is a GET', () => {
    process.env.NODE_ENV = 'not-test'
    mockRequest.method = 'GET'
    xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it('Requires an XSRF token in non-test environment', async () => {
    process.env.NODE_ENV = 'not-test'
    mockRequest.headers = {}
    await expect(() => xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
      new UnauthorizedError(MESSAGES.XSRF_TOKEN_INVALID)
    )
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it('Requires a valid XSRF token in non-test environment', async () => {
    process.env.NODE_ENV = 'not-test'
    await expect(() => xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
      new UnauthorizedError(MESSAGES.XSRF_TOKEN_INVALID)
    )
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
