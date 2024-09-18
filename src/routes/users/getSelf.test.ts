import express from 'express'
import request from 'supertest'
import { ROLES } from '../../constants/database'
import { HTTP_SUCCESS } from '../../constants/http'
import CONTROLLERS from '../../controllers'
import getSelfRoute from './getSelf'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { REQUEST_USER } from '../../types/requestSymbols'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

const fakeUser = makeAFakeUser({ role: ROLES.DEFAULT })

// Mock the middlewares
jest.mock('../../middleware/auth/jsonWebTokens', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req[REQUEST_USER] = { id: '123', role: 'admin' }
    next()
  }),
}))

jest.mock('../../middleware/auth/rbac', () => ({
  checkCanAccessOwnData: jest.fn((req, res, next) => next()),
  getTargetUser: jest.fn((req, res, next) => next()),
  checkCanGetUser: jest.fn((req, res, next) => next()),
}))

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => [fakeUser]),
    }),
  }),
}))

jest.mock('../../services/index', () => ({
  getUserById: jest.fn().mockImplementationOnce(async () => fakeUser),
}))

const app = express()
app.use(express.json())
app.use('/', getSelfRoute)

describe('GET /self', () => {
  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = 'TESTSECRET'
    CONTROLLERS.USER.getSelf = jest.fn(async (_req, res) => {
      return handleSuccessResponse({ res, user: fakeUser })
    })
  })

  it('should call the getSelf controller and get own user data', async () => {
    const response = await request(app)
      .get('/self')
      .set('Authorization', `Bearer ${generateJwtFromUser(fakeUser)}`)
    expect(response.body.user.email).toBe(fakeUser.email)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
