import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import CONTROLLERS from "../../controllers"
import getSelfRoute from "./getSelf"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { REQUEST_USER } from "../../types/requestSymbols"
import { getUserByID } from "../../services/user/getUser"

let fakeUser = makeAFakeUser({ role: ROLES.DEFAULT })

// Mock the middlewares
jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req[REQUEST_USER] = { id: "123", role: "admin" }
    next()
  }),
}))

jest.mock("../../middleware/auth/roleBasedAccessControl", () => ({
  checkCanGetOwnUser: jest.fn((req, res, next) => next()),
}))

jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => [fakeUser]),
    }),
  }),
}))

jest.mock("../../services/index", () => ({
  getUserByID: jest.fn().mockImplementationOnce(async () => fakeUser),
}))

const app = express()
app.use(express.json())
app.use("/", getSelfRoute)

describe("GET /self", () => {
  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    CONTROLLERS.USER.getSelf = jest.fn(async (req, res) => {
      return res.status(HTTP_SUCCESS.OK).json(fakeUser)
    })
  })

  it("should call the getSelf controller and get own user data", async () => {
    const response = await request(app)
      .get(`/self`)
      .set("Authorization", `Bearer ${generateJwtFromUser(fakeUser)}`)
    expect(response.body.email).toBe(fakeUser.email)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
