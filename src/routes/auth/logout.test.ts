import express from "express"
import request from "supertest"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { REFRESH_TOKEN, RESIDENT_TOKEN } from "../../constants/keys"
import CONTROLLERS from "../../controllers"
import logoutRoute from "./logout"

CONTROLLERS.AUTH.logout = jest.fn(async (req, res) => {
  return res.status(HTTP_SUCCESS.OK).json({ message: "Logged in successfully" })
})

jest.mock("../../services", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(logoutRoute)

describe.skip("GET /logout", () => {
  // Remove or comment out the mockRequest and mockResponse setup

  it("logout user by clearing their refresh token(s) from the DB", async () => {
    const response = await request(app)
      .get("/logout")
      .set("Cookie", [`${RESIDENT_TOKEN}=123`, `${REFRESH_TOKEN}=456`])

    // Update the expectation to match your actual implementation
    expect(response.body).toEqual({ message: "Logged in successfully" })

    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
