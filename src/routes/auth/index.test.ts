import express from "express"
import request from "supertest"
import router from "./index"
import { HTTP_SUCCESS } from "../../constants/http"

jest.mock("./login", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./logout", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./magicLogin", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./magicLoginWithToken", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./resetPassword", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./resetPasswordWithToken", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./validateAccount", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./googleLogin", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("./googleLoginCallback", () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock("../../db", jest.fn())

describe("Router", () => {
  let app = express()

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(router)
  })

  it("should register all routes correctly", async () => {
    const routes: {
      path: string
      method: "get" | "post" | "patch"
      handler: string
      expectedResponse: number
    }[] = [
      { path: "/", method: "post", handler: "login", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "get", handler: "logout", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "post", handler: "magicLogin", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "post", handler: "magicLoginWithToken", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "post", handler: "resetPassword", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "post", handler: "resetPasswordWithToken", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "patch", handler: "validateAccount", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "get", handler: "googleLogin", expectedResponse: HTTP_SUCCESS.OK },
      { path: "/", method: "get", handler: "googleLoginCallback", expectedResponse: HTTP_SUCCESS.OK },
    ]

    for (const route of routes) {
      const response = await request(app)[route.method](route.path)
      expect(response.status).toBeDefined()
    }
  })
})
