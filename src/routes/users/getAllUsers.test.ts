import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import CONTROLLERS from "../../controllers"
import { SafeUser } from "../../db/types"
import getAllUsersRoute from "../../routes/users/getAllUsers"
import { makeAFakeSafeUser, makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { handleSuccessResponse } from "../../middleware/util/successHandler"

let fakeUser

// Mock the middlewares
jest.mock('../../middleware/auth/jsonWebTokens', () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = makeAFakeSafeUser({ id: '123', role: ROLES.ADMIN })
    next()
  }),
}))

jest.mock('../../middleware/auth/rbac', () => ({
  checkCanGetAllUsers: jest.fn((_req, _res, next) => next()),
}))

CONTROLLERS.USER.getAllUsers = jest.fn(async (_req, res) => {
  fakeUser = makeAFakeUser({})
  return handleSuccessResponse({ res, users: [fakeUser, fakeUser, fakeUser] })
})

jest.mock('../../services/user/getAllUsers', () => ({
  getAllUsers: jest.fn().mockResolvedValue(() => {
    fakeUser = makeAFakeSafeUser({ role: ROLES.DEFAULT })
    return null //[fakeUser, fakeUser, fakeUser]
  }),
}))

const app = express()
app.use(express.json())
app.use('/', getAllUsersRoute)

describe('GET /users', () => {
  let mockAdmin: SafeUser

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = 'TESTSECRET'
    mockAdmin = makeAFakeSafeUser({ role: ROLES.ADMIN })
  })

  it('should call the getAllUsers controller with valid data', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${generateJwtFromUser(mockAdmin)}`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(response.body).toStrictEqual({})
  })
})
