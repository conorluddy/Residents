import request from "supertest"
import express from "express"
import magicLoginWithTokenRoute from "./magicLoginWithToken"
import CONTROLLERS from "../../controllers"
import { HTTP_SERVER_ERROR } from "../../constants/http"

CONTROLLERS.AUTH.magicLogin = jest.fn(async (req, res) => {
  return res.status(200).send({ message: "Logged in successfully" })
})

jest.mock("../../db", () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(express.json())
app.use(magicLoginWithTokenRoute)

describe("GET /magicLoginWithToken", () => {
  it("should call the magicLogin controller and do nothin because it's not implemented yet", async () => {
    const response = await request(app).get("/magic-login/tokenId")
    expect(response.status).toBe(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })
})
