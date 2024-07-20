import { Request, Response, NextFunction } from "express"
import discardToken from "./discardToken"
import { makeAFakeUser } from "../test-utils/mockUsers"
import { logger } from "../utils/logger"
import db from "../db"
import { TokenWithUser } from "../db/types"
import { TOKEN_TYPE } from "../constants/database"
import { HTTP_CLIENT_ERROR } from "../constants/http"

let tokenWithUser: TokenWithUser = {
  id: "XXX",
  userId: "123",
  used: false,
  user: makeAFakeUser({ id: "123" }),
  type: TOKEN_TYPE.RESET,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // Add 1 hour
}

jest.mock("../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(async () => [{ ...tokenWithUser, used: true }]),
      }),
    }),
  }),
}))

jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe("Middleware: discardToken", () => {
  let mockRequest: Partial<Request> & { tokenWithUser?: Partial<TokenWithUser> }
  let mockResponse: Partial<Response>
  let nextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = { tokenWithUser }
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
    expect(db.update).toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalled()
  })

  it("returns a 403 if missing token in request", async () => {
    mockRequest = {}
    await discardToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(logger.error).toHaveBeenCalledWith("Missing token in discardToken middleware")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token invalid" })
  })

  it("returns a 403 if missing token in request", async () => {
    mockRequest = { tokenWithUser: { ...tokenWithUser, id: "YYY" } }
    await discardToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(logger.error).toHaveBeenCalledWith("Error expiring token ID:YYY")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token invalid" })
  })
})
