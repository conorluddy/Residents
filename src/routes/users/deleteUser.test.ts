import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import deleteUserRouter from "../../routes/users/deleteUser"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../types/requestSymbols"

let fakeUser = makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!", role: ROLES.DEFAULT })

jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = { id: "XX", role: ROLES.MODERATOR }
    next()
  }),
}))

jest.mock("../../middleware/auth/roleBasedAccessControl", () => ({
  checkCanDeleteUsers: jest.fn((_req, _res, next) => next()),
  getTargetUserAndCheckSuperiority: jest.fn((req, _res, next) => {
    req[REQUEST_TARGET_USER_ID] = fakeUser.id
    next()
  }),
}))

jest.mock("../../services/index", () => ({
  deleteUser: jest.fn().mockImplementation(() => fakeUser.id),
}))

const app = express()
app.use(deleteUserRouter)

describe("Route: Delete User", () => {
  it("successfully deletes a user", async () => {
    const response = await request(app).delete(`/${fakeUser.id}`)
    expect(response.body.message).toBe(`User ${fakeUser.id} deleted`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
