import { Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { Token } from "../../db/types"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import discardToken from "./discardToken"
import { ForbiddenError } from "../../errors"
import SERVICES from "../../services"

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

  it("Successfully deletes a token", async () => {
    await discardToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(SERVICES.deleteToken).toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalled()
  })

  it("returns a 403 if missing token in request", async () => {
    mockRequest[REQUEST_TOKEN] = undefined as unknown as Token
    await expect(() => discardToken(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      new ForbiddenError("Missing token in discardToken middleware.")
    )
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("returns a 403 if missing token in request", async () => {
    mockRequest = { [REQUEST_TOKEN]: { ...testToken, id: "YYY" } }
    await expect(() => discardToken(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      new ForbiddenError("Error expiring token ID: YYY")
    )
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
