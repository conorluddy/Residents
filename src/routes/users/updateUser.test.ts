import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import updateUserRouter from "../../routes/users/updateUser"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

let fakeUser = makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!", role: ROLES.DEFAULT })

jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = { id: "XX", role: ROLES.MODERATOR }
    next()
  }),
}))

jest.mock("../../middleware/auth/roleBasedAccessControl", () => ({
  checkCanUpdateUsers: jest.fn((_req, _res, next) => next()),
  getTargetUser: jest.fn((req, _res, next) => {
    req[REQUEST_TARGET_USER_ID] = fakeUser.id
    next()
  }),
}))

jest.mock("../../services/index", () => ({
  updateUser: jest.fn().mockImplementationOnce(async () => fakeUser.id),
}))

const app = express()
app.use(express.json())
app.use(updateUserRouter)

describe("Route: Update User", () => {
  it("successfully updates a user", async () => {
    const response = await request(app).patch(`/${fakeUser.id}`).send({ firstName: "Banana Man" })
    expect(logger.error).not.toHaveBeenCalled()
    expect(response.body.message).toBe(`User ${fakeUser.id} updated successfully`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
