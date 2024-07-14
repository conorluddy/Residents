import { Request, Response, NextFunction } from "express"
import validateRequestToken from "./validateRequestToken"
import { createId } from "@paralleldrive/cuid2"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"

describe("Middleware: validateRequestToken", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {
        token: null,
      },
    } as Request
    mockResponse = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return 400 if the request token is missing", () => {
    validateRequestToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.send).toHaveBeenCalledWith("A token is required")
  })

  it("should return 400 if the request token is invalid", () => {
    mockRequest.body.token = "invalid_token"
    validateRequestToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid token provided")
  })

  it("should call next function if the request token is valid", () => {
    mockRequest.body.token = createId()
    validateRequestToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.send).not.toHaveBeenCalled()
  })
})
