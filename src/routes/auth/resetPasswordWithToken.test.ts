import express from "express"
import request from "supertest"
import { ROLES, TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import resetPasswordWithTokenRoute from "./resetPasswordWithToken"
import { createId } from "@paralleldrive/cuid2"
import { logger } from "../../utils/logger"

const validTokenId = createId()

jest.mock("../../services/index", () => ({
  updateUserPassword: jest.fn().mockImplementation(async () => "UID123"),
  getUserByID: jest.fn().mockImplementation(async () => makeAFakeUser({ role: ROLES.DEFAULT })),
  deleteToken: jest.fn().mockImplementation(async () => "123"),
  getToken: jest.fn().mockImplementation(async () => ({
    id: validTokenId,
    createdAt: new Date(),
    userId: "UID123",
    type: TOKEN_TYPE.RESET,
    used: false,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Add one hour
    user: makeAFakeUser({ email: "bananaman@ireland.ie", id: "UID123" }),
  })),
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
