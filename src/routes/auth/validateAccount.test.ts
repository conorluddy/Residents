import request from "supertest"
import express from "express"
import validateAccountRoute from "./validateAccount"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import { REQUEST_USER } from "../../types/requestSymbols"

jest.mock("../../db", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

jest.mock("../../middleware/auth/jsonWebTokens", () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req[REQUEST_USER] = { id: "123", role: "admin" }
    next()
  }),
}))

const app = express()
app.use(express.json())
app.use(validateAccountRoute)

describe("GET /validateAccount", () => {
  it("should call the validateAccount controller and get an error becauwe we test that fully at the controller", async () => {
    const response = await request(app).patch("/validate/123.ABC")
    expect(response.status).toBe(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
  })
})
