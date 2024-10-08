import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { SafeUser } from '../../db/types'
import { logout } from './logout'
import { REQUEST_USER } from '../../types/requestSymbols'
import { RESIDENT_TOKEN, REFRESH_TOKEN, XSRF_TOKEN } from '../../constants/keys'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

jest.mock('../../services/index', () => ({
  deleteRefreshTokensByUserId: jest.fn().mockImplementation(() => '123'),
}))

describe('Controller: Logout', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      cookies: {
        [RESIDENT_TOKEN]: '123',
        [REFRESH_TOKEN]: '123',
        [XSRF_TOKEN]: '123',
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it('Throws an error if missing the user data', async () => {
    mockRequest.cookies = undefined
    await expect(logout(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.MISSING_USER_ID
    )
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
    expect(mockResponse.cookie).toHaveBeenCalledWith('xsrfToken', '', {
      httpOnly: true,
      expires: expect.any(Date),
      sameSite: 'strict',
      secure: false,
    })
    expect(mockResponse.cookie).toHaveBeenCalledWith('residentToken', '', {
      httpOnly: true,
      expires: expect.any(Date),
      sameSite: 'strict',
      secure: false,
    })
  })
})
