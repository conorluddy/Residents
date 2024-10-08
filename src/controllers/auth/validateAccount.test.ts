import { Response } from 'express'
import { ROLES, TOKEN_TYPE } from '../../constants/database'
import { HTTP_SUCCESS } from '../../constants/http'
import { PublicUser, Token } from '../../db/types'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { REQUEST_TOKEN, REQUEST_USER } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { validateAccount } from './validateAccount'
import { TIMESPAN } from '../../constants/time'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

const mockDefaultUser = makeAFakeSafeUser({ role: ROLES.DEFAULT })
const mockToken: Token = {
  id: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
  type: TOKEN_TYPE.VALIDATE,
  used: false,
  userId: mockDefaultUser.id,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
}

jest.mock('../../services/index', () => ({
  deleteToken: jest.fn().mockImplementation(() => '123'),
  getToken: jest.fn().mockImplementationOnce(() => mockToken),
  updateUserRole: jest.fn().mockImplementation(() => mockDefaultUser.id),
  updateUserStatus: jest.fn().mockImplementation(() => mockDefaultUser.id),
}))

jest.mock('../../utils/generateJwt', () => ({
  generateJwtFromUser: jest.fn().mockReturnValue({}),
}))

describe('Controller: Validate Account', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_USER]: PublicUser; [REQUEST_TOKEN]?: Token }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      params: { tokenId: mockToken.id, userId: mockDefaultUser.id },
      [REQUEST_USER]: mockDefaultUser,
      [REQUEST_TOKEN]: mockToken,
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Validates a users account when the token is found and matches the user', async () => {
    await validateAccount(mockRequest as ResidentRequest, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith(`${MESSAGES.USER_VALIDATED} ${mockDefaultUser.id}`)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.ACCOUNT_VALIDATED })
  })

  it('Returns forbidden when missing token', async () => {
    mockRequest[REQUEST_TOKEN] = undefined
    await expect(validateAccount(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.TOKEN_MISSING
    )
  })

  it('Returns forbidden when missing userId from URL', async () => {
    mockRequest.params = { tokenId: 'TOKEN001' }
    await expect(validateAccount(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.INVALID_USER_DATA
    )
  })

  it('Returns forbidden when missing userId from URL', async () => {
    mockRequest[REQUEST_TOKEN] = {
      id: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
      type: TOKEN_TYPE.MAGIC,
      used: false,
      userId: mockDefaultUser.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
    }
    await expect(validateAccount(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.VALIDATION_TOKEN_INVALID
    )
  })

  it('Returns forbidden when the token ID does not match the user ID', async () => {
    mockRequest[REQUEST_TOKEN] = {
      id: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
      type: TOKEN_TYPE.VALIDATE,
      used: false,
      userId: 'NOT_THE_SAME',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
    }
    await expect(validateAccount(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.VALIDATION_TOKEN_INVALID
    )
  })
})
