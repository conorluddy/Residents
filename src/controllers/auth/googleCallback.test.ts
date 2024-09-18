import { NextFunction, Request, Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { googleCallback } from './googleCallback'
import { OAuth2Client } from 'google-auth-library'
import { EmailError, NotFoundError, UnauthorizedError } from '../../errors'

jest.mock('google-auth-library')
jest.mock('../../services', () => ({
  getUserById: jest.fn().mockImplementation(() => makeAFakeSafeUser({ username: 'Hackerman' })),
  getUserByEmail: jest
    .fn()
    .mockImplementationOnce(() => makeAFakeSafeUser({ username: 'Hackermaner' }))
    .mockImplementationOnce(() => null),
}))

describe('Controller: GoogleCallback', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const mockNext = jest.fn().mockReturnThis()

  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = 'test-client-id'
  })

  beforeEach(() => {
    mockRequest = {
      body: { idToken: 'fake-id-token' },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('successfully authenticates a user with Google', async () => {
    const fakePayload = { sub: '123', email: 'test@example.com' }

    ;(OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
      getPayload: jest.fn().mockReturnValue(fakePayload),
    })
    await googleCallback(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)

    expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith({
      idToken: 'fake-id-token',
      audience: 'test-client-id',
    })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ token: expect.any(String) })
  })

  it('returns unauthorized when token is invalid', async () => {
    ;(OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
      getPayload: jest.fn().mockReturnValue(null),
    })
    await expect(
      googleCallback(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow(UnauthorizedError)
  })

  it('throws EmailError when no email is found in Google payload', async () => {
    const fakePayload = { sub: '123' }

    ;(OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
      getPayload: jest.fn().mockReturnValue(fakePayload),
    })

    await expect(
      googleCallback(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow(EmailError)
  })

  it('throws NotFoundError when user is not found', async () => {
    const fakePayload = { sub: '123', email: 'nope@example.com' }

    ;(OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
      getPayload: jest.fn().mockReturnValue(fakePayload),
    })

    await expect(
      googleCallback(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow(NotFoundError)
  })
})
