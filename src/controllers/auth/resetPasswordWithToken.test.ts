import { Response } from 'express'
import { TOKEN_TYPE } from '../../constants/database'
import { HTTP_SUCCESS } from '../../constants/http'
import { Token } from '../../db/types'
import { REQUEST_TOKEN } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { resetPasswordWithToken } from './resetPasswordWithToken'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

jest.mock('../../mail/sendgrid', () => ({
  sendMail: jest.fn(),
}))

jest.mock('../../services/index', () => ({
  deleteToken: jest.fn(),
  updateUserPassword: jest
    .fn()
    .mockImplementationOnce(() => 'UID123')
    .mockImplementationOnce(() => 'NOT_SAME'),
}))

describe('Controller: Reset Password With Token', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_TOKEN]?: Token }
  let mockResponse: Partial<Response>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      body: {
        password: '__sTR0nGP45$WRD___',
      },
      [REQUEST_TOKEN]: {
        id: '123',
        createdAt: new Date(),
        userId: 'UID123',
        type: TOKEN_TYPE.RESET,
        used: false,
        expiresAt: new Date(),
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Happy path: Reset Password With Token', async () => {
    await resetPasswordWithToken(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.PASSWORD_RESET_SUCCESS })
    expect(logger.info).toHaveBeenCalledWith(`${MESSAGES.PASSWORD_WAS_RESET} UID:UID123`)
  })

  it('Unhappy path: Reset Password With Token', async () => {
    await expect(resetPasswordWithToken(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      `${MESSAGES.PASSWORD_UPDATE_ERROR} UID:UID123`
    )
  })

  it('Returns forbidden when missing token', async () => {
    mockRequest[REQUEST_TOKEN] = undefined
    await expect(resetPasswordWithToken(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.TOKEN_MISSING
    )
  })

  it('Returns forbidden when an incorrect type of token is used', async () => {
    mockRequest[REQUEST_TOKEN] = {
      ...mockRequest[REQUEST_TOKEN]!,
      type: TOKEN_TYPE.MAGIC,
    }
    await expect(resetPasswordWithToken(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.INVALID_TOKEN_TYPE
    )
  })

  it('Returns bad request when the requested new password fails password strength test', async () => {
    mockRequest.body.password = 'password1'
    await expect(resetPasswordWithToken(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.WEAK_PASSWORD
    )
  })
})
