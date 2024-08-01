import request from "supertest"
import express from "express"
import refreshTokenRoute from "./refreshToken"
import CONTROLLERS from "../../controllers"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"

CONTROLLERS.AUTH.refreshToken = jest.fn(async (req, res) => {
  return res.status(HTTP_SUCCESS.OK).json({ message: "Logged in successfully" })
})

jest.mock("../../db", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(express.json())
app.use(refreshTokenRoute)

describe("POST /refresh", () => {
  it("should call the refreshToken controller and get rejected by default", async () => {
    const response = await request(app).post("/refresh")
    expect(response.status).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})
