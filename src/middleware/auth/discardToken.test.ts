import { Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR } from "../../constants/http"
import { Token } from "../../db/types"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import discardToken from "./discardToken"

let testToken: Token = {
  id: "XXX",
  userId: "123",
  used: false,
  type: TOKEN_TYPE.RESET,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // Add 1 hour
}

jest.mock("../../services/index", () => ({
  deleteToken: jest.fn().mockImplementation(() => "XXX"),
}))

describe("Middleware: discardToken", () => {
  let mockRequest: Partial<Request> & { [REQUEST_TOKEN]: Token }
  let mockResponse: Partial<Response>
  let nextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = { [REQUEST_TOKEN]: testToken }
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("Successfully marks a token as used if valid", async () => {
    await discardToken(mockRequest as Request, mockResponse as Response, nextFunction)
    // expect(db.update).toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalled()
  })

  it("returns a 403 if missing token in request", async () => {
    mockRequest[REQUEST_TOKEN] = undefined as unknown as Token
    await discardToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(logger.error).toHaveBeenCalledWith("Missing token in discardToken middleware")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token invalid" })
  })

  it("returns a 403 if missing token in request", async () => {
    mockRequest = { [REQUEST_TOKEN]: { ...testToken, id: "YYY" } }
    await discardToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(logger.error).toHaveBeenCalledWith("Error expiring token ID:YYY")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token invalid" })
  })
})
