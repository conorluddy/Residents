import express from "express"
import request from "supertest"
import { ROLES } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import updateUserMetaRouter from "../../routes/users/updateUserMeta"
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
  checkCanUpdateUsers: jest.fn((_req, _res, next) => next()),
  getTargetUserAndEnsureSuperiority: jest.fn((req, _res, next) => {
    req[REQUEST_TARGET_USER_ID] = fakeUser.id
    next()
  }),
}))

jest.mock("../../services/index", () => ({
  updateUserMeta: jest.fn().mockImplementation(() => fakeUser.id),
}))

const app = express()
app.use(express.json())
app.use(updateUserMetaRouter)

describe("Route: Update User Meta", () => {
  it("successfully updates user meta", async () => {
    const response = await request(app).patch(`/meta/${fakeUser.id}`).send({ metaItem: "Meta Update" })
    expect(response.body.message).toBe(`User meta for ${fakeUser.id} updated successfully`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
