import { NextFunction, Request, Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { User } from '../../db/types'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import { getUser } from './getUser'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'

let fakeUser: Partial<User>

jest.mock('../../services/user/getUserById', () => ({
  getUserById: jest
    .fn()
    .mockImplementationOnce(async () => {
      fakeUser = makeAFakeUser({})
      return fakeUser
    })
    .mockImplementationOnce(async () => {
      return undefined
    })
    .mockImplementationOnce(async () => {
      throw new Error('DB error.')
    }),
}))

describe('Controller: GetUser', () => {
  let mockRequest: Partial<Request> & { [REQUEST_TARGET_USER_ID]?: string }
  let mockResponse: Partial<Response>
  const mockNext = jest.fn().mockReturnThis()

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      [REQUEST_TARGET_USER_ID]: 'ID',
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Happy path', async () => {
    await getUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ user: fakeUser })
  })

  it('Missing User ID', async () => {
    delete mockRequest[REQUEST_TARGET_USER_ID]
    await expect(getUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow('User ID is missing.')
  })

  it('User not found', async () => {
    await expect(getUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow('User not found.')
  })

  it('Error handling', async () => {
    await expect(getUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow('DB error.')
  })
})
