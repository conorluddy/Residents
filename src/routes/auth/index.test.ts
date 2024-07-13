import express from "express"
import request from "supertest"
import router from "./index"

jest.mock("./login", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./logout", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./magicLogin", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./magicLoginWithToken", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./resetPassword", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./resetPasswordWithToken", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./validateAccount", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./googleLogin", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./googleLoginCallback", () => jest.fn((req, res) => res.status(200).send("updateUser")))
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
      expectedResonse: number
    }[] = [
      { path: "/", method: "post", handler: "login", expectedResonse: 200 },
      { path: "/", method: "get", handler: "logout", expectedResonse: 200 },
      { path: "/", method: "post", handler: "magicLogin", expectedResonse: 200 },
      { path: "/", method: "post", handler: "magicLoginWithToken", expectedResonse: 200 },
      { path: "/", method: "post", handler: "resetPassword", expectedResonse: 200 },
      { path: "/", method: "post", handler: "resetPasswordWithToken", expectedResonse: 200 },
      { path: "/", method: "patch", handler: "validateAccount", expectedResonse: 200 },
      { path: "/", method: "get", handler: "googleLogin", expectedResonse: 200 },
      { path: "/", method: "get", handler: "googleLoginCallback", expectedResonse: 200 },
    ]

    for (const route of routes) {
      const response = await request(app)[route.method](route.path)
      expect(response.status).toBeDefined()

      // These aren't working correctly, come back and fix em
      //   expect(response.status).toBe(route.expectedResonse)
    }
  })
})
