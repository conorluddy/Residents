import request from "supertest"
import express from "express"
import loginRoute from "./login"
import CONTROLLERS from "../../controllers"
import { logger } from "../../utils/logger"
import { HTTP_CLIENT_ERROR } from "../../constants/http"

CONTROLLERS.AUTH.login = jest.fn(async (req, res) => {
  return res.status(200).send({ message: "Logged in successfully" })
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
