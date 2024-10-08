import { NextFunction, Response } from 'express'
import { ROLES } from '../../constants/database'
import { SafeUser } from '../../db/types'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import findUserByValidEmail from './findUserByValidEmail'
import { REQUEST_EMAIL, REQUEST_USER } from '../../types/requestSymbols'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

jest.mock('../../services/index', () => ({
  getUserByEmail: jest
    .fn()
    .mockReturnValueOnce(makeAFakeUser({ role: ROLES.DEFAULT, email: 'validated@email.com', username: 'MrFake' }))
    .mockReturnValueOnce(null)
    .mockReturnValueOnce(null),
}))

describe('Middleware:findUserByValidEmail', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_EMAIL]?: string; [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockDefaultUser: SafeUser

  beforeAll(() => {
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
    mockRequest = {
      user: mockDefaultUser,
      [REQUEST_EMAIL]: 'validated@email.com',
    }
  })

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  // Technically RBAC wouldn't let a user with the DEFAULT role access this endpoint,
  // but the middleware should still wotk in isolation and not care about the user's role.
  it('Happy path: Valid email used to find valid user', async () => {
    await findUserByValidEmail(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(mockRequest[REQUEST_USER]).toHaveProperty('email', 'validated@email.com')
    expect(mockRequest[REQUEST_USER]).toHaveProperty('username', 'MrFake')
    expect(nextFunction).toHaveBeenCalled()
  })
  it('[REQUEST_EMAIL] does not exist in the request', async () => {
    mockRequest[REQUEST_EMAIL] = undefined
    await expect(
      findUserByValidEmail(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).rejects.toThrow(MESSAGES.EMAIL_REQUIRED)
  })
  it('[REQUEST_EMAIL] holds an invalid email address', async () => {
    mockRequest[REQUEST_EMAIL] = 'notAnEmail'
    await expect(
      findUserByValidEmail(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).rejects.toThrow(MESSAGES.INVALID_EMAIL)
  })
})
