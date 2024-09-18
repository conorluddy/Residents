import request from 'supertest'
import jwt from 'jsonwebtoken'
import { HTTP_CLIENT_ERROR, HTTP_REDIRECTION, HTTP_SUCCESS } from './constants/http'
import { app } from './index'
import { logger } from './utils/logger'
import { JWT_TOKEN_SECRET } from './config'

jest.mock('./utils/logger')
jest.mock('./db', () => ({}))

describe('Test SIGTERM handling', () => {
  test('should log messages on SIGTERM', (done) => {
    process.emit('SIGTERM')
    setTimeout(() => {
      expect(logger.info).toHaveBeenCalledWith('SIGTERM signal received: closing HTTP server')
      expect(logger.info).toHaveBeenCalledWith('HTTP server closed')
      done()
    }, 500)
  })
})

describe('Test the root path', () => {
  test('It should respond unauthorized to the GET method', async () => {
    const response = await request(app).get('/users')
    expect(response.statusCode).toBe(HTTP_CLIENT_ERROR.UNAUTHORIZED)
  })

  test('It should respond with a 404 for an unknown path', async () => {
    const response = await request(app).get('/unknown')
    expect(response.statusCode).toBe(HTTP_CLIENT_ERROR.NOT_FOUND)
  })
})

describe('Test the /auth/login path', () => {
  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = 'TESTSECRET'
  })

  test('It should throw a bad request because of the email format.', async () => {
    const csrfToken = jwt.sign({}, JWT_TOKEN_SECRET!, { expiresIn: '1h' })

    const response = await request(app)
      .post('/auth')
      .set('Cookie', `xsrfToken=${csrfToken}`)
      .set('x-csrf-token', csrfToken)
      .send({ email: 'email', password: 'lemme-in' })

    expect(response.statusCode).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})

describe('Test the health check route', () => {
  test('It should respond with a status of "👌"', async () => {
    const response = await request(app).get('/health')
    expect(response.statusCode).toBe(HTTP_SUCCESS.OK)
    expect(response.body).toEqual({ message: "👌" })
  })
})
