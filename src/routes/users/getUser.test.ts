import express from "express"
import request from "supertest"
import getUserRoute from "../../routes/users/getUser"
import CONTROLLERS from "../../controllers"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { PublicUser, SafeUser } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_TARGET_USER, REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../types/requestSymbols"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { handleSuccessResponse } from "../../middleware/util/successHandler"

const fakeUser: SafeUser = makeAFakeUser({ password: '$TR0ngP@$$W0rDz123!', id: 'TARGET_USER_ID' })
const app = express()
app.use(express.json())
app.use('/user', getUserRoute)

// Mock the middlewares
jest.mock('../../middleware/auth/jsonWebTokens', () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = { id: '123', role: ROLES.ADMIN }
    next()
  }),
}))

jest.mock('../../middleware/auth/rbac', () => ({
  checkCanGetUser: jest.fn((req, res, next) => next()),
  getTargetUser: jest.fn((req, res, next) => {
    req[REQUEST_USER] = { id: '123', role: ROLES.ADMIN }
    req[REQUEST_TARGET_USER] = fakeUser
    req[REQUEST_TARGET_USER_ID] = fakeUser.id
    next()
  }),
}))

jest.mock('../../services/user/getUserById', () => ({
  getUserById: jest.fn().mockImplementationOnce(async () => fakeUser),
}))

CONTROLLERS.USER.getUser = jest.fn(async (_req, res) => {
  return handleSuccessResponse({ res, message: "User retrieved successfully" })
})

describe('GET /user/:id', () => {
  let mockDefaultUser: PublicUser

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = 'TESTSECRET'
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  it('should call the getUser controller with valid data', async () => {
    const userId = fakeUser.id
    const response = await request(app)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${generateJwtFromUser(mockDefaultUser)}`)

    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(response.body.user.id).toBe("TARGET_USER_ID")
  })
})
