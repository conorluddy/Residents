import { NextFunction, Response } from 'express'
import { ROLES } from '../../constants/database'
import { PublicUser, User } from '../../db/types'
import { makeAFakeSafeUser, makeAFakeUser } from '../../test-utils/mockUsers'
import { REQUEST_USER } from '../../types/requestSymbols'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { authenticateToken } from './jsonWebTokens'
import { UnauthorizedError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

describe('Middleware:JWT', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_USER]: PublicUser }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockDefaultUser: User
  let jwt

  beforeAll(() => {
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  beforeEach(() => {
    jwt = generateJwtFromUser(mockDefaultUser)
    mockRequest = {
      [REQUEST_USER]: makeAFakeSafeUser({ id: 'AdminTestUser1', role: ROLES.ADMIN }),
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it('Happy Path: should allow passthrough if the JWT is verified', () => {
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    authenticateToken(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it('Should reject as unauthorized if there is no token in the request', async () => {
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    delete mockRequest?.headers?.authorization

    await expect(() =>
      authenticateToken(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).toThrow(new UnauthorizedError(MESSAGES.JWT_TOKEN_NOT_PROVIDED))

    expect(nextFunction).not.toHaveBeenCalled()
  })

  it('Should reject as unauthorized if the token has expired', async () => {
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    mockRequest.headers = { authorization: `Bearer ${generateJwtFromUser(mockDefaultUser, '1ms')}` }

    await expect(() =>
      authenticateToken(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).toThrow(new UnauthorizedError(MESSAGES.TOKEN_INVALID))

    expect(nextFunction).not.toHaveBeenCalled()
  })

  it('Should reject as unauthorized if the token has expired', async () => {
    jwt = generateJwtFromUser(mockDefaultUser, '0ms')
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    if (mockRequest.headers?.authorization) {
      mockRequest.headers.authorization = `Bearer ${jwt}`
    }

    await expect(() =>
      authenticateToken(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).toThrow(new UnauthorizedError(MESSAGES.TOKEN_INVALID))

    expect(nextFunction).not.toHaveBeenCalled()
  })
})
