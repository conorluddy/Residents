import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { User } from '../../db/types'
import { makeAFakeUserWithHashedPassword } from '../../test-utils/mockUsers'
import { login } from './login'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

jest.mock('../../services/index', () => ({
  getUserByUsername: jest
    .fn()
    .mockImplementationOnce(() => makeAFakeUserWithHashedPassword({ password: 'testpassword' })),
  getUserByEmail: jest.fn().mockImplementationOnce(() => makeAFakeUserWithHashedPassword({ password: 'testpassword' })),
  getUserPasswordHash: jest
    .fn()
    .mockImplementationOnce(async () => (await makeAFakeUserWithHashedPassword({ password: 'testpassword' })).password),
  createToken: jest.fn().mockImplementation(() => 'token123'),
}))

jest.mock('../../utils/generateJwt', () => ({
  generateJwtFromUser: jest.fn().mockReturnValue('fakeToken'),
}))

describe('Controller: Login', () => {
  let mockRequest: Partial<ResidentRequest> & { body: Partial<User> }
  let mockResponse: Partial<Response>

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = 'TESTSECRET'
  })

  beforeEach(() => {
    mockRequest = {
      body: {
        username: 'MrFake',
        email: 'mrfake@gmail.com',
        password: 'testpassword',
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it('should allow login with correct username and password', async () => {
    await login(mockRequest as ResidentRequest, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ token: 'fakeToken' })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', 'token123', {
      httpOnly: true,
      maxAge: 60000,
      sameSite: 'strict',
      secure: false,
    })
  })

  it('should reject login with incorrect username', async () => {
    mockRequest.body.username = 'MrsFake'
    mockRequest.body.password = 'testpassword'
    await expect(login(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_NOT_FOUND
    )
  })

  it('should reject login with incorrect password', async () => {
    mockRequest.body.username = 'MrFake'
    mockRequest.body.password = 'wrongpassword'
    await expect(login(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_NOT_FOUND
    )
  })

  it('should reject login with missing username/password', async () => {
    mockRequest.body.username = null
    mockRequest.body.email = null
    mockRequest.body.password = 'testpassword'
    await expect(login(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USERNAME_OR_EMAIL_REQUIRED
    )
  })

  it('should reject login with missing password', async () => {
    mockRequest.body.username = 'MrFake'
    mockRequest.body.password = null
    await expect(login(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.PASSWORD_REQUIRED
    )
  })

  it('should reject login with invalid email address', async () => {
    mockRequest.body.username = null
    mockRequest.body.email = 'notanemailaddress'
    mockRequest.body.password = 'testpassword'
    await expect(login(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.INVALID_EMAIL
    )
  })

  it('should catch errors', async () => {
    delete mockRequest.cookies
    await expect(login(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_NOT_FOUND
    )
  })
})
