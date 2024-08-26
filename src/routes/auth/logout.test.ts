import request from "supertest"
import express from "express"
import logoutRoute from "./logout"
import CONTROLLERS from "../../controllers"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { ROLES } from "../../constants/database"

CONTROLLERS.AUTH.logout = jest.fn(async (req, res) => {
  return res.status(HTTP_SUCCESS.OK).json({ message: "Logged in successfully" })
})

jest.mock("../../db", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(logoutRoute)

describe("GET /logout", () => {
  let mockDefaultUser: Partial<User>
  let mockRequest: Partial<Request> & { user: Partial<User> }
  let mockResponse: Partial<Response>

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })

    mockRequest = {
      user: {
        id: "123",
        username: "test",
        firstName: "updatedFName",
        lastName: "test",
        email: "test@email.com",
      },
    }
    mockResponse = {
      json: jest.fn(),
    }
  })

  it("logout user by clearing their refresh token(s) from the DB", async () => {
    const response = await request(app).get("/logout")
    expect(response.status).toBe(HTTP_CLIENT_ERROR.UNAUTHORIZED)
  })
})
