import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import CONTROLLERS from "../../controllers"
import { PublicUser, User } from "../../db/types"
import getUserRoute from "../../routes/users/getUser"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import { generateJwtFromUser } from "../../utils/generateJwt"

// Mock the middlewares
jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req[REQUEST_USER] = { id: "123", role: "admin" }
    next()
  }),
}))

jest.mock("../../middleware/auth/roleBasedAccessControl", () => ({
  checkCanGetUsers: jest.fn((req, res, next) => next()),
  getTargetUserAndCheckSuperiority: jest.fn((req, res, next) => next()),
}))

CONTROLLERS.USER.getUser = jest.fn(async (req, res) => {
  return res.status(HTTP_SUCCESS.OK).json({ message: "User retrieved successfully" })
})

let fakeUser: User
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => {
        fakeUser = await makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!", id: "ABC123" })
        return [fakeUser]
      }),
    }),
  }),
}))

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
