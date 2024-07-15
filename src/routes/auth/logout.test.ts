import request from "supertest"
import express from "express"
import logoutRoute from "./logout"
import CONTROLLERS from "../../controllers"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"

CONTROLLERS.AUTH.logout = jest.fn(async (req, res) => {
  return res.status(HTTP_SUCCESS.OK).json({ message: "Logged in successfully" })
})

jest.mock("../../db", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(logoutRoute)

describe("GET /logout", () => {
  it("should call the logout controller and do nothin because it's not implemented yet", async () => {
    const response = await request(app).get("/logout")
    expect(response.status).toBe(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })
})
