import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { SafeUser } from '../../db/types'
import { logout } from './logout'
import { REQUEST_USER } from '../../types/requestSymbols'
import { REFRESH_TOKEN } from '../../constants/keys'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

jest.mock('../../services/index', () => ({
  deleteRefreshTokensByUserId: jest.fn().mockImplementation(() => '123'),
  getToken: jest.fn().mockImplementation(() => ({ userId: '123' })),
}))

describe('Controller: Logout', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      cookies: {
        [REFRESH_TOKEN]: '123',
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it('Throws an error if the refresh token cookie is absent', async () => {
    mockRequest.cookies = undefined
    await expect(logout(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.REFRESH_TOKEN_REQUIRED
    )
  })

  it('Still succeeds if the refresh token is not found in the DB (graceful degradation)', async () => {
    const SERVICES = jest.requireMock('../../services/index')
    SERVICES.getToken.mockImplementationOnce(() => null)
    await logout(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.LOGOUT_SUCCESS })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })

  it('logs out a user by deleting any of their refresh tokens', async () => {
    await logout(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.LOGOUT_SUCCESS })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', '', {
      httpOnly: true,
      expires: expect.any(Date),
      sameSite: 'strict',
      secure: false,
    })
  })
})
