import express from "express"
import request from "supertest"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import validateAccountRoute from "./validateAccount"

const user = makeAFakeUser({ email: "bananaman@ireland.ie", id: "UID123" })

jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = { id: "ABC", role: "admin" }
    next()
  }),
}))

jest.mock("../../services/index", () => ({
  getToken: jest.fn().mockImplementationOnce(() => ({
    user,
    id: "validTokenId",
    createdAt: new Date(),
    userId: "UID123",
    type: TOKEN_TYPE.VALIDATE,
    used: false,
    expiresAt: new Date(Date.now() + TIMESPAN.MINUTE),
  })),
  // updateUserStatus: jest.fn().mockImplementationOnce(async () => "x"),
}))

const app = express()
app.use(express.json())
app.use(validateAccountRoute)

describe("GET /validateAccount", () => {
  it("should call the validateAccount controller", async () => {
    const response = await request(app).patch("/validate/123.ABC")
    expect(logger.error).not.toHaveBeenCalled()
    expect(response.body).toBe("x")
    expect(response.status).toBe(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
  })
})
