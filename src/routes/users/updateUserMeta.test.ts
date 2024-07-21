import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import updateUserMetaRouter from "../../routes/users/updateUserMeta"
import { makeAFakeUser } from "../../test-utils/mockUsers"

let fakeUser = makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!", role: ROLES.DEFAULT })

jest.mock("../../middleware/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req.user = { id: "XX", role: ROLES.MODERATOR }
    next()
  }),
}))

jest.mock("../../middleware/roleBasedAccessControl", () => ({
  checkCanUpdateUsers: jest.fn((_req, _res, next) => next()),
  getTargetUserAndCheckSuperiority: jest.fn((req, _res, next) => {
    req.targetUserId = fakeUser.id
    next()
  }),
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
app.use(updateUserMetaRouter)

describe("Route: Update User Meta", () => {
  it("successfully updates user meta", async () => {
    const response = await request(app).patch(`/meta/${fakeUser.id}`).send({ metaItem: "Meta Update" })
    expect(response.body.message).toBe(`User ${fakeUser.id} updated successfully`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
