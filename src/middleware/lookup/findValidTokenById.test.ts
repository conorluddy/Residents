import { NextFunction, Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR } from "../../constants/http"
import { Token } from "../../db/types"
import { REQUEST_TOKEN, REQUEST_TOKEN_ID } from "../../types/requestSymbols"
import findValidTokenById from "./findValidTokenById"

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  query: {
    tableTokens: {
      findFirst: jest
        .fn()
        .mockReturnValueOnce({
          id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
          type: TOKEN_TYPE.MAGIC,
          used: false,
          createdAt: new Date(),
          expiresAt: new Date().setFullYear(new Date().getFullYear() + 1),
        })
        .mockReturnValueOnce({
          id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
          type: TOKEN_TYPE.MAGIC,
          used: true,
          createdAt: new Date(),
          expiresAt: new Date().setFullYear(new Date().getFullYear() + 1),
        })
        .mockReturnValueOnce({
          id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
          type: TOKEN_TYPE.MAGIC,
          used: false,
          createdAt: new Date(),
          expiresAt: new Date(),
        }),
    },
  },
}))

describe("Middleware:findValidTokenById", () => {
  let mockRequest: Partial<Request> & { [REQUEST_TOKEN_ID]: string }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      [REQUEST_TOKEN_ID]: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("Happy path: Find valid token in DB", async () => {
    await findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockRequest[REQUEST_TOKEN]).toHaveProperty("id", "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX")
    expect(nextFunction).toHaveBeenCalled()
  })

  it("ValidatedToken doesn't exist in the request, return bad request", async () => {
    mockRequest[REQUEST_TOKEN_ID] = undefined as unknown as string
    await findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `Valid token required` })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Token is flagged as used, return forbidden", async () => {
    await findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token has already been used" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Token has expired, return forbidden", async () => {
    await findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token has expired" })
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
