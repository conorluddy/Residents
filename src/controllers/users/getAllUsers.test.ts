import { Response } from 'express'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import { HTTP_SUCCESS } from '../../constants/http'
import { getAllUsers } from './getAllUsers'
import { User } from '../../db/types'
import { ResidentRequest } from '../../types'

const fakeUser: Partial<User> = makeAFakeUser({ id: '123' })

jest.mock('../../services/index', () => ({
  getAllUsers: jest
    .fn()
    .mockImplementationOnce(() => [fakeUser, fakeUser, fakeUser])
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(() => {
      throw new Error('S.N.A.F.U')
    }),
}))

describe('Controller: GetAllUsers', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Gets All Users', async () => {
    await getAllUsers(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ users: [fakeUser, fakeUser, fakeUser] })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })

  it('Gets No Users', async () => {
    await getAllUsers(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ users: [] })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })

  it('Handles an error from the service', async () => {
    await expect(getAllUsers(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow('S.N.A.F.U')
  })
})
