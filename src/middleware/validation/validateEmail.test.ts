import { Request, Response, NextFunction } from "express"
import validateEmail from "./validateEmail"

describe("Middleware: validateEmail", () => {
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

  it("should return 400 if the request email is missing", async () => {
    await expect(validateEmail(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      "Email is required"
    )
  })

  it("should return 400 if the request email is invalid", async () => {
    mockRequest.body.email = "thatsnotanemail"
    await expect(validateEmail(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      "Invalid email address"
    )
  })

  it("should call next function if email is valid", async () => {
    mockRequest.body.email = "thats@anemail.com"
    await validateEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
