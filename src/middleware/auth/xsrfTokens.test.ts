import { NextFunction, Request, Response } from "express"
import { ROLES } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import xsrfTokens from "./xsrfTokens"

jest.mock("../../utils/logger")

describe("Middleware: XSRF Tokens: ", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let originalEnv: string | undefined

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV

    mockRequest = {
      user: { role: ROLES.ADMIN, id: "AdminTestUser1" },
      headers: {
        "xsrf-token": "123",
      },
      cookies: {
        xsrfToken: "123",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it("Returns early in test environment", () => {
    xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it("Returns early if request is a GET", () => {
    process.env.NODE_ENV = "not-test"
    mockRequest.method = "GET"
    xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it("Requires an XSRF token in non-test environment", async () => {
    process.env.NODE_ENV = "not-test"
    mockRequest.headers = {}
    xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "XSRF token is required." })
  })

  it("Requires a valid XSRF token in non-test environment", async () => {
    process.env.NODE_ENV = "not-test"
    xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "XSRF token is invalid." })
  })

  it("Catches errors, not feelings", async () => {
    process.env.NODE_ENV = "not-test"
    delete mockRequest.cookies
    xsrfTokens(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error validating request." })
  })
})
