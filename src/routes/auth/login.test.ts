import request from "supertest"
import express from "express"
import loginRoute from "./login"
import CONTROLLERS from "../../controllers"
import { HTTP_CLIENT_ERROR } from "../../constants/http"
import { handleSuccessResponse } from "../../middleware/util/successHandler"

CONTROLLERS.AUTH.login = jest.fn(async (_req, res) => {
  return handleSuccessResponse({ res, message: "Logged in successfully" })
})

jest.mock("../../db", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

const app = express()
app.use(loginRoute)

describe("POST /login", () => {
  it("should call the login controller and respond with a 400 BAD_REQUEST status if no login data is sent", async () => {
    const response = await request(app).post("/")
    expect(response.status).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})
