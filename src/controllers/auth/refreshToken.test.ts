import { refreshToken } from './refreshToken'
import { Request, Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import { ROLES } from '../../constants/database'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { User } from '../../db/types'
import { logger } from '../../utils/logger'
import generateXsrfToken from '../../middleware/util/xsrfToken'
import jwt from 'jsonwebtoken'
import { RESIDENT_TOKEN } from '../../constants/keys'
import MESSAGES from '../../constants/messages'

const mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })

jest.mock('jsonwebtoken')
jest.mock('../../utils/generateJwt', () => ({
  generateJwtFromUser: jest.fn().mockReturnValue('testAccessToken'),
}))

jest.mock('../../services/index', () => ({
  getUserById: jest.fn().mockImplementation(() => mockDefaultUser),
  deleteRefreshTokensByUserId: jest.fn().mockImplementation(() => '123'),
  createToken: jest.fn().mockImplementation(() => 'tok1'),
  deleteToken: jest.fn().mockImplementation(() => '123'),
  getToken: jest
    .fn()
    .mockImplementationOnce(() => ({
      id: 'tok0',
      userId: mockDefaultUser.id,
    }))
    .mockImplementationOnce(() => undefined)
    .mockImplementationOnce(() => ({
      id: 'tok1',
      userId: '456',
    }))
    .mockImplementationOnce(() => ({
      id: 'tok3',
      used: true,
      userId: mockDefaultUser.id,
    }))
    .mockImplementationOnce(() => ({
      id: 'tok2',
      expiresAt: new Date(Date.now() - 1000),
      userId: mockDefaultUser.id,
    })),
}))

describe('Controller: Refresh token: Happy path', () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>
  let jwtDecodeSpy: jest.MockedFunction<typeof jwt.decode>
  let xsrf: string
  let token: string

  beforeAll(() => {
    jwtDecodeSpy = jest.spyOn(jwt, 'decode') as jest.MockedFunction<typeof jwt.decode>
    jwtDecodeSpy.mockReturnValue({ id: mockDefaultUser.id })
  })

  beforeEach(() => {
    process.env.JWT_TOKEN_SECRET = 'TESTSECRET'
    token = generateJwtFromUser(mockDefaultUser)
    xsrf = generateXsrfToken()
    mockRequest = {
      body: {},
      headers: { authorization: `Bearer ${token}` },
      cookies: { refreshToken: 'REFRESHME', [RESIDENT_TOKEN]: mockDefaultUser.id },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    }
  })

  it('should allow tokens to refresh if existing tokens are legit', async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith({ token: 'testAccessToken' })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.cookie).toHaveBeenCalledTimes(3)
    expect(mockResponse.cookie).toHaveBeenNthCalledWith(1, 'refreshToken', 'tok1', {
      httpOnly: true,
      maxAge: 60000,
      sameSite: 'strict',
      secure: false,
    })
    expect(mockResponse.cookie).toHaveBeenNthCalledWith(2, 'xsrfToken', xsrf, {
      httpOnly: true,
      maxAge: 60000,
      sameSite: 'strict',
      secure: false,
    })
    expect(mockResponse.cookie).toHaveBeenNthCalledWith(3, 'residentToken', mockDefaultUser.id, {
      httpOnly: true,
      maxAge: 60000,
      sameSite: 'strict',
      secure: false,
    })
  })
})

describe('Should return errors if', () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>
  let token: string
  let jwtDecodeSpy: jest.MockedFunction<typeof jwt.decode>
  const otherMockDefaultUser = makeAFakeUser({ role: ROLES.MODERATOR })

  beforeAll(() => {
    // jest.resetAllMocks()
    jwtDecodeSpy = jest.spyOn(jwt, 'decode') as jest.MockedFunction<typeof jwt.decode>
    jwtDecodeSpy.mockReturnValue({ ...mockDefaultUser })
  })

  beforeEach(() => {
    process.env.JWT_TOKEN_SECRET = 'TESTSECRET'
    token = generateJwtFromUser(otherMockDefaultUser)
    mockRequest = {
      body: {},
      headers: {
        authorization: `Bearer ${token}`,
      },
      cookies: { refreshToken: 'REFRESHME', [RESIDENT_TOKEN]: mockDefaultUser.id },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it('theres no refresh token in the request body', async () => {
    delete mockRequest.cookies?.refreshToken
    await expect(refreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      MESSAGES.REFRESH_TOKEN_REQUIRED
    )
  })

  it('theres no UserId in the cookies', async () => {
    delete mockRequest.cookies?.[RESIDENT_TOKEN]
    await expect(refreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      MESSAGES.REFRESH_TOKEN_COUNTERPART_REQUIRED
    )
  })
  it('the token isnt found in the database', async () => {
    await expect(refreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      MESSAGES.TOKEN_NOT_FOUND
    )
  })
  it('the token user does not match the JWT user', async () => {
    await expect(refreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      MESSAGES.TOKEN_USER_INVALID
    )
  })
  it('the token has a USED flag set', async () => {
    await expect(refreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(MESSAGES.TOKEN_USED)
  })
  it('the token has expired', async () => {
    await expect(refreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(MESSAGES.TOKEN_EXPIRED)
  })
})
