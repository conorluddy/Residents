import { Token } from '../../db/types'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { Response } from 'express'
import { magicLoginWithToken } from './magicLoginWithToken'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'
import { REQUEST_TOKEN } from '../../types/requestSymbols'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { HTTP_SUCCESS } from '../../constants/http'

jest.mock('../../services/index', () => ({
  getUserById: jest
    .fn()
    .mockResolvedValue(makeAFakeSafeUser({ email: 'mr@token.com' }))
    .mockResolvedValueOnce(null),
  deleteToken: jest.fn().mockReturnThis(),
  createToken: jest.fn().mockResolvedValue('refreshToken01'),
}))

describe('Controller: MagicLoginWithToken', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_TOKEN]?: Token }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      [REQUEST_TOKEN]: {
        userId: 'USER01',
        type: TOKEN_TYPE.MAGIC,
        id: 'TOK',
        used: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + TIMESPAN.MINUTE),
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    }
  })

  it('Throws an error if a token isnt provided', async () => {
    mockRequest[REQUEST_TOKEN] = undefined
    await expect(magicLoginWithToken(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.TOKEN_REQUIRED
    )
  })

  it('Throws an error if a user isnt found matching the given token', async () => {
    await expect(magicLoginWithToken(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_NOT_FOUND_FOR_TOKEN
    )
  })

  it('Creates a token, returns a JWT, and sets all the cookies', async () => {
    await magicLoginWithToken(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ token: expect.any(String) })
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'refreshToken01',
      expect.objectContaining({
        httpOnly: true,
        maxAge: 60000,
        sameSite: 'strict',
        secure: false,
      })
    )
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'xsrfToken',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        maxAge: 60000,
        sameSite: 'strict',
        secure: false,
      })
    )
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'residentToken',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        maxAge: 60000,
        sameSite: 'strict',
        secure: false,
      })
    )
  })
})
