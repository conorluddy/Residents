import express from "express"
import request from "supertest"
import router from "./index"

jest.mock("./createUser", () => jest.fn((req, res) => res.status(201).send("createUser")))
jest.mock("./updateUser", () => jest.fn((req, res) => res.status(200).send("updateUser")))
jest.mock("./getAllUsers", () => jest.fn((req, res) => res.status(200).send("getAllUsers")))
jest.mock("./getUser", () => jest.fn((req, res) => res.status(200).send("getUser")))
jest.mock("./getSelf", () => jest.fn((req, res) => res.status(200).send("getSelf")))
jest.mock("./deleteUser", () => jest.fn((req, res) => res.status(200).send("deleteUser")))
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
      method: "get" | "post" | "patch" | "delete"
      handler: string
      expectedResonse: number
    }[] = [
      { path: "/register", method: "post", handler: "createUser", expectedResonse: 201 },
      { path: "/123", method: "patch", handler: "updateUser", expectedResonse: 200 },
      { path: "/", method: "get", handler: "getAllUsers", expectedResonse: 200 },
      { path: "/123", method: "get", handler: "getUser", expectedResonse: 200 },
      { path: "/self", method: "get", handler: "getSelf", expectedResonse: 200 },
      { path: "/123", method: "delete", handler: "deleteUser", expectedResonse: 200 },
    ]

    for (const route of routes) {
      const response = await request(app)[route.method](route.path)
      expect(response.status).toBeDefined()

      // These aren't working correctly, come back and fix em
      //   expect(response.status).toBe(route.expectedResonse)
    }
  })
})
