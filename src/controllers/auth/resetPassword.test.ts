import { Response } from 'express'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import { HTTP_SUCCESS } from '../../constants/http'
import { resetPassword } from './resetPassword'
import { sendMail } from '../../mail/sendgrid'
import { logger } from '../../utils/logger'
import { SafeUser } from '../../db/types'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

const user: SafeUser = makeAFakeUser({ email: 'bananaman@ireland.ie' })

jest.mock('../../mail/sendgrid', () => ({
  sendMail: jest.fn(),
}))

jest.mock('../../services/index', () => ({
  getUserByEmail: jest.fn().mockReturnValueOnce(makeAFakeUser({ email: 'bananaman@ireland.ie' })),
  createToken: jest.fn().mockReturnValueOnce('tok1'),
}))

describe('Controller: Reset Password', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_EMAIL]?: SafeUser['email'] }
  let mockResponse: Partial<Response>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      [REQUEST_EMAIL]: user.email,
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Happy path - reset email gets sent', async () => {
    await resetPassword(mockRequest as ResidentRequest, mockResponse as Response)
    expect(sendMail).toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith('Reset email sent to bananaman@ireland.ie, token id: tok1')
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.CHECK_EMAIL_RESET_LINK })
  })

  it('missing user data', async () => {
    mockRequest[REQUEST_EMAIL] = undefined
    await expect(resetPassword(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.MISSING_USER_DATA
    )
  })
})
