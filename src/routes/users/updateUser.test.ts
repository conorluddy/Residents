import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import updateUserRouter from "../../routes/users/updateUser"
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
    checkCanUpdateUsers: jest.fn((_req, _res, next) => next()),
    getTargetUserAndCheckSuperiority: jest.fn((req, _res, next) => {
      req.targetUserId = fakeUser.id
      next()
    }),
  },
}))

jest.mock("../../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [{ updatedId: fakeUser.id }]),
      }),
    }),
  }),
}))

const app = express()
app.use(express.json())
app.use(updateUserRouter)

describe("Route: Update User", () => {
  it("successfully updates a user", async () => {
    const response = await request(app).patch(`/${fakeUser.id}`).send({ firstName: "Banana Man" })
    expect(response.body.message).toBe(`User ${fakeUser.id} updated successfully`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
