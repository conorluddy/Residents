import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { LoginError } from '../../errors'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { ResidentRequest } from '../../types'
import { googleCallback } from './googleCallback'
import MESSAGES from '../../constants/messages'

jest.mock('google-auth-library')
jest.mock('../../services', () => ({
  getUserById: jest.fn().mockImplementation(() => makeAFakeSafeUser({ username: 'Hackerman' })),
  getUserByEmail: jest
    .fn()
    .mockImplementationOnce(() => makeAFakeSafeUser({ username: 'Hackermaner' }))
    .mockImplementationOnce(() => null),
}))
jest.mock('../../utils/generateJwt', () => ({
  generateJwtFromUser: jest.fn().mockReturnValue('JWT'),
}))

describe('Controller: GoogleCallback', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>

  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = 'test-client-id'
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockRequest = {
      user: makeAFakeSafeUser({ username: 'Hackerman' }),
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('successfully authenticates a user with Google', async () => {
    await googleCallback(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ token: 'JWT' })
  })

  it('throws LoginError when user is not found', () => {
    delete mockRequest.user
    expect(() => googleCallback(mockRequest as ResidentRequest, mockResponse as Response)).toThrow(
      new LoginError(MESSAGES.USER_NOT_FOUND_FEDERATED_CREDENTIALS)
    )
  })
})
