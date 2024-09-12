import express from "express"
import request from "supertest"
import getUserRoute from "../../routes/users/getUser"
import CONTROLLERS from "../../controllers"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { PublicUser, SafeUser } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import { generateJwtFromUser } from "../../utils/generateJwt"

let fakeUser: SafeUser

// Mock the middlewares
jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req[REQUEST_USER] = { id: "123", role: "admin" }
    next()
  }),
}))

jest.mock("../../middleware/auth/rbac", () => ({
  checkCanGetUser: jest.fn((req, res, next) => next()),
  getTargetUser: jest.fn((req, res, next) => next()),
}))

jest.mock("../../services/user/getUserById", () => ({
  getUserById: jest.fn().mockImplementationOnce(async () => {
    fakeUser = await makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!", id: "ABC123" })
    return [fakeUser]
  }),
}))

CONTROLLERS.USER.getUser = jest.fn(async (req, res) => {
  return res.status(HTTP_SUCCESS.OK).json({ message: "User retrieved successfully" })
})

const app = express()
app.use(express.json())
app.use("/user", getUserRoute)

describe("GET /user/:id", () => {
  let mockDefaultUser: PublicUser

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  it("should call the getUser controller with valid data", async () => {
    const userId = "123"
    const response = await request(app)
      .get(`/user/${userId}`)
      .set("Authorization", `Bearer ${generateJwtFromUser(mockDefaultUser)}`)

    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(response.body[0].id).toBe("ABC123")
  })
})
