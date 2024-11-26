import { Response } from 'express'
import { LoginError } from '../../errors'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { ResidentRequest } from '../../types'
import { googleCallback, googleLoginRedirectURL } from './googleCallback'
import MESSAGES from '../../constants/messages'

jest.mock('google-auth-library')
jest.mock('../../services', () => ({
  createToken: jest.fn().mockImplementation(() => 'JWT'),
  getUserById: jest.fn().mockImplementation(() => makeAFakeSafeUser({ username: 'Hackerman' })),
  getUserByEmail: jest
    .fn()
    .mockImplementationOnce(() => makeAFakeSafeUser({ username: 'Hackerman' }))
    .mockImplementationOnce(() => null),
}))
jest.mock('../../utils/generateJwt', () => ({
  generateJwtFromUser: jest.fn().mockReturnValue('JWT'),
}))

describe('Controller: GoogleCallback', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>
  const user = makeAFakeSafeUser({ username: 'Hackerman' })

  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = 'test-client-id'
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequest = { user }
    mockResponse = {
      redirect: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it('successfully authenticates a user with Google', async () => {
    await googleCallback(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.redirect).toHaveBeenCalledWith(`${googleLoginRedirectURL}?token=JWT`)
    expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', 'JWT', {
      httpOnly: true,
      maxAge: 60000,
      sameSite: 'strict',
      secure: false,
    })
  })

  it('throws LoginError when user is not found', async () => {
    delete mockRequest.user
    await expect(() => googleCallback(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      new LoginError(MESSAGES.USER_NOT_FOUND_FEDERATED_CREDENTIALS)
    )
  })
})
