import dotenv from "dotenv"
import request from "supertest"
import { HTTP_CLIENT_ERROR, HTTP_REDIRECTION, HTTP_SUCCESS } from "./constants/http"
import { app, server } from "./index"
import jwt from "jsonwebtoken"
import { logger } from "./utils/logger"
dotenv.config()

jest.mock("./utils/logger")
jest.mock("./db", () => ({}))

describe("Test the health check route", () => {
  test('It should respond with a status of "👌"', async () => {
    const response = await request(app).get("/health")
    expect(response.statusCode).toBe(HTTP_SUCCESS.OK)
    expect(response.body).toEqual({ status: "👌" })
  })
})

describe("Test SIGTERM handling", () => {
  test("should log messages on SIGTERM", (done) => {
    const logSpy = jest.spyOn(logger, "info")
    process.emit("SIGTERM")
    setTimeout(() => {
      expect(logSpy).toHaveBeenCalledWith("SIGTERM signal received: closing HTTP server")
      expect(logSpy).toHaveBeenCalledWith("HTTP server closed")
      done()
    }, 500)
  })
})

// Spot tests to cover the app index.ts file. Routes are tested in their own files.

describe("Test the root path", () => {
  test("It should respond unauthorized to the GET method", async () => {
    const response = await request(app).get("/users")
    expect(response.statusCode).toBe(HTTP_CLIENT_ERROR.UNAUTHORIZED)
  })

  test("It should respond with a 404 for an unknown path", async () => {
    const response = await request(app).get("/unknown")
    expect(response.statusCode).toBe(HTTP_CLIENT_ERROR.NOT_FOUND)
  })
})

describe("Test the /auth/login path", () => {
  test("It should throw a bad request because of the email format.", async () => {
    // Generate XSRF token
    const xsrfToken = jwt.sign({}, process.env.JWT_TOKEN_SECRET ?? "", { expiresIn: "1h" })

    const response = await request(app)
      .post("/auth")
      .set("Cookie", `XSRF-TOKEN=${xsrfToken}`)
      .set("x-xsrf-token", xsrfToken)
      .send({ email: "email", password: "lemme-in" })

    expect(response.statusCode).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})

// Think we need to give Github env secrets for testing this
describe.skip("Test the /auth/google path", () => {
  test("It should respond with a 302 for the Google endpoint", async () => {
    const response = await request(app).get("/auth/google")
    expect(response.statusCode).toBe(HTTP_REDIRECTION.FOUND)
  })
})
