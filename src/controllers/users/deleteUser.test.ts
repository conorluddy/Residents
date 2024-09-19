import { Request, Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { User } from '../../db/types'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { deleteUser } from './deleteUser'
import MESSAGES from '../../constants/messages'

let fakeUser: Partial<User>

jest.mock('../../services/index', () => ({
  deleteUser: jest
    .fn()
    .mockImplementationOnce(async () => {
      fakeUser = makeAFakeUser({})
      return fakeUser.id
    })
    .mockImplementationOnce(async () => {
      throw new Error('Error deleting user')
    }),
}))

describe('Controller: Delete User', () => {
  let mockRequest: Partial<Request> & { [REQUEST_TARGET_USER_ID]: string }
  let mockResponse: Partial<Response>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      [REQUEST_TARGET_USER_ID]: 'ID',
      params: { id: 'ID' },
      body: {
        username: 'test',
        firstName: 'updatedFName',
        lastName: 'test',
        email: 'test@email.com',
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Happy path', async () => {
    await deleteUser(mockRequest as Request, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ${fakeUser.id} deleted` })
  })

  it('Missing ID', async () => {
    mockRequest.params = {}
    await expect(deleteUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(MESSAGES.MISSING_USER_ID)
  })

  it('Missing [REQUEST_TARGET_USER_ID]', async () => {
    mockRequest[REQUEST_TARGET_USER_ID] = ''
    await expect(deleteUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(MESSAGES.MISSING_USER_ID)
  })

  it('target user ID does not match url param user ID', async () => {
    mockRequest[REQUEST_TARGET_USER_ID] = 'PersonToDelete'
    mockRequest.params = { id: 'OtherPersonInURL' }
    await expect(deleteUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_ID_MISMATCH
    )
  })
})
