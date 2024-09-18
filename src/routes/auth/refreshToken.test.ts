import request from "supertest"
import express from "express"
import refreshTokenRoute from "./refreshToken"
import CONTROLLERS from "../../controllers"
import { HTTP_CLIENT_ERROR } from "../../constants/http"
import { handleSuccessResponse } from "../../middleware/util/successHandler"

CONTROLLERS.AUTH.refreshToken = jest.fn(async (req, res) => {
  return handleSuccessResponse({ res, message: "Logged in successfully" })
})

jest.mock("../../services/index", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(express.json())
app.use(refreshTokenRoute)

describe.skip("POST /refresh", () => {
  it("should call the refreshToken controller", async () => {
    const response = await request(app)
      .post("/refresh")
      .set("Cookie", "refreshToken=REFRESHME")
      .set("Cookie", "residentToken=123")

    expect(response.status).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})
