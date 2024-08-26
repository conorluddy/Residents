import { Request, Response, NextFunction } from "express"
import validateTokenId from "./tokenId"
import { createId } from "@paralleldrive/cuid2"
import { HTTP_CLIENT_ERROR } from "../../constants/http"

describe("Middleware: validateTokenId", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = { body: { tokenId: null } } as Request
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return 400 if the request token is missing", () => {
    validateTokenId(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "A token is required" })
  })

  it("should return 400 if the request token is invalid", () => {
    mockRequest.body.tokenId = "invalid_token"
    validateTokenId(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid token provided" })
  })

  it("should call next function if the request token is valid", () => {
    mockRequest.body.tokenId = createId()
    validateTokenId(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
