import { Request, Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { createUser } from './createUser'
import { ROLES } from '../../constants/database'
import MESSAGES from '../../constants/messages'

jest.mock('../../services/index', () => ({
  createToken: jest.fn(),
  createUserMeta: jest.fn(),
  createUser: jest.fn().mockImplementation(() => '123'),
}))

describe('Controller: CreateUser', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      body: {
        username: 'FakeUser',
        firstName: 'Fake',
        lastName: 'User',
        email: 'fakeuser@fake.com',
        password: '$TR0ngP@$$W0rDz123!',
        role: ROLES.DEFAULT,
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Create User - Happy path', async () => {
    await createUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.CREATED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.USER_REGISTERED })
  })

  it('Create User - Missing data', async () => {
    mockRequest.body = {}
    await expect(createUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      'Missing required fields.'
    )
  })

  it('Create User - Invalid email', async () => {
    mockRequest.body.email = 'invalid-email'
    await expect(createUser(mockRequest as Request, mockResponse as Response)).rejects.toThrow('Invalid email address')
  })
})
