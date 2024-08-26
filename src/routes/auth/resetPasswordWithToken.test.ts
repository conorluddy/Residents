import { createId } from "@paralleldrive/cuid2"
import express from "express"
import request from "supertest"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { makeAFakeSafeUser } from "../../test-utils/mockUsers"
import { REQUEST_TOKEN, REQUEST_TOKEN_ID, REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import resetPasswordWithTokenRoute from "./resetPasswordWithToken"

const user = makeAFakeSafeUser({ email: "bananaman@ireland.ie", id: "UID123" })
const validTokenId = createId()
const token = {
  user,
  id: validTokenId,
  userId: user.id,
  type: TOKEN_TYPE.RESET,
  used: false,
  expiresAt: new Date(Date.now() + TIMESPAN.MINUTE),
  createdAt: new Date(),
}

jest.mock("../../services/index", () => ({
  updateUserPassword: jest.fn().mockImplementation(() => "UID123"),
  getUserByID: jest.fn().mockImplementation(() => user),
  deleteToken: jest.fn().mockImplementation(() => token.id),
  getToken: jest.fn().mockImplementation(() => token),
}))

jest.mock("../../middleware", () => ({
  VALIDATE: {
    tokenId: jest.fn((req, res, next) => {
      req[REQUEST_TOKEN_ID] = validTokenId
      next()
    }),
  },
  findValidTokenById: jest.fn((req, res, next) => {
    req[REQUEST_USER] = user
    req[REQUEST_TOKEN] = token

    next()
  }),
  discardToken: jest.fn((req, res, next) => next()),
}))

const app = express()

app.use(express.json())
app.use(resetPasswordWithTokenRoute)

describe("Route: POST:resetPasswordWithToken", () => {
  it("should call the resetPasswordWithToken controller and respond with a 400 BAD_REQUEST status if no resetPasswordWithToken data is sent", async () => {
    const response = await request(app)
      .post(`/reset-password/${validTokenId}`)
      .send({ password: "the.NEWpassword_is-$3cuRE" })

    expect(logger.error).not.toHaveBeenCalled()
    expect(response.body).toStrictEqual({ message: "Password successfully updated." })
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
