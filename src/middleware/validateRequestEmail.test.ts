import { Request, Response, NextFunction } from "express"
import validateRequestEmail from "./validateRequestEmail"

describe("Middleware: validateRequestEmail", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {
        email: null,
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

  it("should return 400 if the request email is missing", () => {
    validateRequestEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith("Email is required")
  })

  it("should return 400 if the request email is invalid", () => {
    mockRequest.body.email = "thatsnotanemail"
    validateRequestEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith("Invalid email address")
  })

  it("should call next function if email is valid", () => {
    mockRequest.body.email = "thats@anemail.com"
    validateRequestEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
