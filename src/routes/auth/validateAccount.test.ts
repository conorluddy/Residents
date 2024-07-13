import request from "supertest"
import express from "express"
import validateAccountRoute from "./validateAccount"
import CONTROLLERS from "../../controllers"
import { HTTP_SERVER_ERROR } from "../../constants/http"

jest.mock("../../db", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

jest.mock("../../middleware/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req.user = { id: "123", role: "admin" }
    next()
  }),
}))

const app = express()
app.use(express.json())
app.use(validateAccountRoute)

describe("GET /validateAccount", () => {
  it("should call the validateAccount controller and do nothin because it's not implemented yet", async () => {
    const response = await request(app).patch("/validate/123.ABC")
    expect(response.status).toBe(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })
})
