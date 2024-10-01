import { makeAFakeUser } from '../../test-utils/mockUsers'
import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { magicLogin } from './magicLogin'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { sendMail } from '../../mail/sendgrid'
import SERVICES from '../../services'

jest.mock('../../services/index', () => ({
  getUserByEmail: jest
    .fn()
    .mockResolvedValueOnce(makeAFakeUser({ email: 'bananaman@ireland.ie' }))
    .mockResolvedValueOnce(null),
  deleteMagicTokensByUserId: jest.fn().mockReturnThis(),
  createToken: jest.fn().mockReturnValue('123'),
}))
jest.mock('../../mail/sendgrid', () => ({
  sendMail: jest.fn(),
}))

describe('Controller: Magic Login', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_EMAIL]?: string }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequest = {
      [REQUEST_EMAIL]: 'bananaman@ireland.ie',
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('should bomb out early if you dont provide an email address', async () => {
    delete mockRequest[REQUEST_EMAIL]
    await expect(magicLogin(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.EMAIL_REQUIRED
    )
  })

  it('should create a token and send an email to the user if the user email is found', async () => {
    await magicLogin(mockRequest as ResidentRequest, mockResponse as Response)
    expect(logger.info).toHaveBeenCalledWith('Magic login email sent. bananaman@ireland.ie, token id: 123')
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.CHECK_EMAIL_MAGIC_LINK })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(SERVICES.createToken).toHaveBeenCalled()
    expect(sendMail).toHaveBeenCalled()
  })

  it('shouldnt actually create a token or send a mail if user not found, but send same response', async () => {
    await magicLogin(mockRequest as ResidentRequest, mockResponse as Response)
    expect(logger.info).not.toHaveBeenCalled()
    expect(sendMail).not.toHaveBeenCalled()
    expect(SERVICES.createToken).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.CHECK_EMAIL_MAGIC_LINK })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })
})
