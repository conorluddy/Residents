import express from 'express'
import request from 'supertest'
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from '../../constants/http'
import CONTROLLERS from '../../controllers'
import createUserRoute from '../../routes/users/createUser'
import { logger } from '../../utils/logger'
import { ROLES } from '../../constants/database'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'

CONTROLLERS.USER.createUser = jest.fn(async (_req, res) => {
  await handleSuccessResponse({ res, message: MESSAGES.USER_CREATED })
})

jest.mock('../../services/index', () => ({
  createToken: jest.fn(),
  createUserMeta: jest.fn(),
  createUser: jest.fn().mockImplementation(() => '123'),
}))

const app = express()
app.use(express.json())
app.use('/', createUserRoute)

describe('POST /register', () => {
  it('should call the register controller with valid data', async () => {
    const requestBody = {
      username: 'testuser',
      password: 'password123!@$1P',
      email: 'testuser@gmail.com',
      role: ROLES.DEFAULT,
      firstName: 'Test',
      lastName: 'User',
    }
    const response = await request(app).post('/register').send(requestBody)
    expect(logger.error).not.toHaveBeenCalled()
    expect(response.body.message).toBe(MESSAGES.USER_REGISTERED)
    expect(response.status).toBe(HTTP_SUCCESS.CREATED)
  })

  it('should return BAD_REQUEST with invalid email', async () => {
    const requestBody = {
      username: 'testuser',
      password: 'password123',
      email: 'invalid-email',
    }
    const response = await request(app).post('/register').send(requestBody)
    expect(response.status).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })

  it('should return BAD_REQUEST when email is missing', async () => {
    const requestBody = {
      username: 'testuser',
      password: 'password123',
      // Missing email
    }
    const response = await request(app).post('/register').send(requestBody)
    expect(response.status).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})
