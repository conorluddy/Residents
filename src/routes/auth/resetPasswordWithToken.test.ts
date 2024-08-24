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
  getUserByID: jest.fn().mockImplementation(() => makeAFakeUser({ role: ROLES.DEFAULT })),
  deleteToken: jest.fn().mockImplementation(() => "123"),
  getToken: jest.fn().mockImplementation(() => ({
    id: validTokenId,
    createdAt: new Date(),
    userId: "UID123",
    type: TOKEN_TYPE.RESET,
    used: false,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Add one hour
    user: makeAFakeUser({ email: "bananaman@ireland.ie", id: "UID123" }),
  })),
}))

// Update this to use mocked service when update service is done
jest.mock("../../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest
          .fn()
          // Updates the token in the DiscardToken middleware
          .mockImplementationOnce(async () => {
            return [{ id: validTokenId }]
          })
          // Updates the user password in the controller
          .mockImplementationOnce(async () => {
            return [{ updatedUserId: "UID123" }]
          }),
      }),
    }),
  }),
}))

const app = express()
app.use(express.json())
app.use(resetPasswordWithTokenRoute)

describe("Route: POST:resetPasswordWithToken", () => {
  it("should call the resetPasswordWithToken controller and respond with a 400 BAD_REQUEST status if no resetPasswordWithToken data is sent", async () => {
    const response = await request(app)
      .post(`/reset-password/${validTokenId}`)
      .send({ password: "the.NEWpassword_is-$3cuRE" })

    expect(response.body).toStrictEqual({ message: "Password successfully updated." })
    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(logger.error).not.toHaveBeenCalled()
  })
})
