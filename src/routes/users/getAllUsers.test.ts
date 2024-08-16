import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import CONTROLLERS from "../../controllers"
import { PublicUser, User } from "../../db/types"
import getAllUsersRoute from "../../routes/users/getAllUsers"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { REQUEST_USER } from "../../types/requestSymbols"

// Mock the middlewares
jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = { id: "123", role: "admin" }
    next()
  }),
}))

jest.mock("../../middleware/auth/roleBasedAccessControl", () => ({
  checkCanGetUsers: jest.fn((req, res, next) => next()),
}))

CONTROLLERS.USER.getAllUsers = jest.fn(async (_req, res) => {
  return res.status(HTTP_SUCCESS.OK).json({ message: "Users retrieved successfully" })
})

let fakeUser: User
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockImplementationOnce(async () => {
      fakeUser = await makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!", id: "ABC123" })
      return [fakeUser, fakeUser, fakeUser]
    }),
  }),
}))

const app = express()
app.use(express.json())
app.use("/", getAllUsersRoute)

describe("GET /users", () => {
  let mockDefaultUser: PublicUser

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  it("should call the getAllUsers controller with valid data", async () => {
    const response = await request(app)
      .get(`/`)
      .set("Authorization", `Bearer ${generateJwtFromUser(mockDefaultUser)}`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(response.body).toHaveLength(3)
  })
})
