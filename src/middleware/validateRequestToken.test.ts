import { Request, Response, NextFunction } from "express"
import validateRequestToken from "../middleware/validateRequestToken"
import { createId } from "@paralleldrive/cuid2"

describe("validateRequestToken middleware", () => {
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
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>

    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return 400 if the request token is missing", () => {
    const expectedResponse = "A token is required"

    validateRequestToken(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse)
  })

  it("should return 400 if the request token is invalid", () => {
    mockRequest.body.token = "invalid_token"
    const expectedResponse = "Invalid token provided"

    validateRequestToken(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse)
  })

  it("should call next function if the request token is valid", () => {
    mockRequest.body.token = createId()

    validateRequestToken(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.send).not.toHaveBeenCalled()
  })
})
