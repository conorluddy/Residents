import dotenv from "dotenv"
import request from "supertest"
import { HTTP_CLIENT_ERROR, HTTP_REDIRECTION } from "./constants/http"
import { app, server } from "./index"
import { logger } from "./utils/logger"
dotenv.config()

jest.mock("./utils/logger")
jest.mock("./db", () => ({}))

describe("Test the health check route", () => {
  test('It should respond with a status of "👌"', async () => {
    const response = await request(app).get("/health")
    expect(response.statusCode).toBe(200)
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
    const response = await request(app).post("/auth").send({ email: "email", password: "lemme-in" })
    expect(response.statusCode).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})

describe("Test the /auth/google path", () => {
  test("It should respond with a 302 for the Google endpoint", async () => {
    const response = await request(app).get("/auth/google")
    expect(response.statusCode).toBe(HTTP_REDIRECTION.FOUND)
  })
})
