import { Request, Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { User } from '../../db/types'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { updateUser } from './updateUser'
import MESSAGES from '../../constants/messages'

const fakeUser: Partial<User> = makeAFakeUser({})

jest.mock('../../services/index', () => ({
  updateUser: jest.fn().mockImplementationOnce(() => fakeUser.id),
}))

describe('Controller: UpdateUser', () => {
  let mockRequest: Partial<Request> & { params: { id?: string }; [REQUEST_TARGET_USER_ID]?: string }
  let mockResponse: Partial<Response>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      params: {
        id: 'ID',
      },
      [REQUEST_TARGET_USER_ID]: 'ID',
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

  it(MESSAGES.USER_UPDATED, async () => {
    await updateUser(mockRequest as Request, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ${fakeUser.id} updated successfully` })
  })

  it('Responds with Bad Request when IDs are missing', async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: '',
    }
    await expect(updateUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      'User ID is missing in the request.'
    )
  })

  it('Responds with Forbidden if ID and verified target ID dont match', async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: 'NotTheFakerUsersID',
    }

    await expect(updateUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_ID_MISMATCH
    )
  })

  it('Responds with Bad Request if no update data is provided', async () => {
    mockRequest.body = {}

    await expect(updateUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      'No udpate data provided.'
    )
  })
})
