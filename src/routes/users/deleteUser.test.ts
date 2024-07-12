import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import deleteUserRouter from "../../routes/users/deleteUser"
import { makeAFakeUser } from "../../test-utils/mockUsers"

let fakeUser = makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!", role: ROLES.DEFAULT })

jest.mock("../../middleware/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req.user = { id: "XX", role: ROLES.MODERATOR }
    next()
  }),
}))

jest.mock("../../middleware/roleBasedAccessControl", () => ({
  RBAC: {
    checkCanDeleteUsers: jest.fn((_req, _res, next) => next()),
    checkRoleSuperiority: jest.fn((req, _res, next) => {
      req.targetUserId = fakeUser.id
      next()
    }),
  },
}))

jest.mock("../../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [{ deletedUserId: fakeUser.id }]),
      }),
    }),
  }),
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
