import { Request, Response, NextFunction } from "express"
import validateUserMeta from "./userMeta"
import { createId } from "@paralleldrive/cuid2"
import { HTTP_CLIENT_ERROR } from "../../constants/http"

describe("Middleware: validateUserMeta", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: undefined,
    } as Request
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return 400 if the request body is missing", () => {
    validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid data provided." })
  })

  it("should return 400 if the request body is null", () => {
    mockRequest.body = null
    validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid data provided." })
  })

  it("should return 400 if the request body is invalid", () => {
    mockRequest.body = { randomProperty: "randomValue" }
    validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid data provided. Some items are not allowed." })
  })

  it("should call next function if the request token is valid", () => {
    mockRequest.body = {
      metaItem: "metaItem",
    }
    validateUserMeta(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
