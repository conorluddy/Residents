import express from "express"
import request from "supertest"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_TOKEN, REQUEST_USER } from "../../types/requestSymbols"
import validateAccountRoute from "./validateAccount"
import { createId } from "@paralleldrive/cuid2"
import { logger } from "../../utils/logger"

const user = makeAFakeUser({ email: "bananaman@ireland.ie", id: "UID123" })
const validTokenId = createId()

jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = { id: "ABC", role: "admin" }
    next()
  }),
}))

jest.mock("../../services/index", () => ({
  getToken: jest.fn().mockImplementationOnce(() => ({
    user,
    id: validTokenId,
    createdAt: new Date(),
    userId: "UID123",
    type: TOKEN_TYPE.VALIDATE,
    used: false,
    expiresAt: new Date(Date.now() + TIMESPAN.MINUTE),
  })),
  deleteToken: jest.fn().mockImplementationOnce(async () => "x"),
}))

const app = express()
app.use(express.json())
app.use(validateAccountRoute)
app.use((req, _res, next) => {
  req[REQUEST_TOKEN] = { id: validTokenId, type: "VALIDATE" }
  next()
})

describe("GET /validateAccount", () => {
  it("should call the validateAccount controller", async () => {
    const response = await request(app).patch(`/validate/${validTokenId}.${user.id}`)
    expect(logger.error).not.toHaveBeenCalled()
    expect(response.body).toBe("Error expiring token ID:")
    expect(response.status).toBe(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
  })
})
