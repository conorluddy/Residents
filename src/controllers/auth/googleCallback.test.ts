import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { googleCallback } from './googleCallback'
import { EmailError, NotFoundError, UnauthorizedError } from '../../errors'
import { ResidentRequest } from '../../types'

jest.mock('google-auth-library')
jest.mock('../../services', () => ({
  getUserById: jest.fn().mockImplementation(() => makeAFakeSafeUser({ username: 'Hackerman' })),
  getUserByEmail: jest
    .fn()
    .mockImplementationOnce(() => makeAFakeSafeUser({ username: 'Hackermaner' }))
    .mockImplementationOnce(() => null),
}))

describe.skip('Controller: GoogleCallback', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>

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
    await googleCallback(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ token: expect.any(String) })
  })

  it('returns unauthorized when token is invalid', async () => {
    await expect(googleCallback(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      UnauthorizedError
    )
  })

  it('throws EmailError when no email is found in Google payload', async () => {
    await expect(googleCallback(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(EmailError)
  })

  it('throws NotFoundError when user is not found', async () => {
    await expect(googleCallback(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      NotFoundError
    )
  })
})
