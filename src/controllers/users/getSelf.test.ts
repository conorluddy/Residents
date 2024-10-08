import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { SafeUser, User } from '../../db/types'
import { makeAFakeSafeUser, makeAFakeUser } from '../../test-utils/mockUsers'
import { REQUEST_USER } from '../../types/requestSymbols'
import { getSelf } from './getSelf'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

let fakeUser: Partial<User>

jest.mock('../../services/index', () => ({
  getUserById: jest
    .fn()
    .mockImplementationOnce(() => {
      fakeUser = makeAFakeUser({ id: 'SELF_ID' })
      return fakeUser
    })
    .mockImplementationOnce(() => {
      return undefined
    })
    .mockImplementationOnce(() => {
      throw new Error('DB error')
    }),
}))

describe('Controller: GetSelf', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      [REQUEST_USER]: makeAFakeSafeUser({ id: 'SELF_ID' }),
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Happy path', async () => {
    await getSelf(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ user: fakeUser })
  })

  it('Missing ID is handled', async () => {
    mockRequest[REQUEST_USER] = undefined
    await expect(getSelf(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.MISSING_USER_ID
    )
  })

  it('User not found in DB (shouldnt happen for getSelf but o/)', async () => {
    await expect(getSelf(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_NOT_FOUND
    )
  })
})
