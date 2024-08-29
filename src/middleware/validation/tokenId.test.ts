import { Request, Response, NextFunction } from "express"
import validateTokenId from "./tokenId"
import { BadRequestError } from "../../errors"
import { createId } from "@paralleldrive/cuid2"

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

  it("should throw BadRequestError if the request token is missing", async () => {
    await expect(() => validateTokenId(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      BadRequestError
    )
  })

  it("should throw BadRequestError if the request token is invalid", async () => {
    mockRequest.body.tokenId = "invalid_token"
    await expect(() => {
      validateTokenId(mockRequest as Request, mockResponse as Response, nextFunction)
    }).toThrow(BadRequestError)
  })

  it("should call next function if the request token is valid", () => {
    mockRequest.body.tokenId = createId()
    validateTokenId(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
})
