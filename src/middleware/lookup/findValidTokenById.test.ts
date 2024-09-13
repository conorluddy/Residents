import { NextFunction, Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"
import { Token } from "../../db/types"
import { REQUEST_TOKEN, REQUEST_TOKEN_ID } from "../../types/requestSymbols"
import findValidTokenById from "./findValidTokenById"

jest.mock("../../services/index", () => ({
  getToken: jest
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
}))

describe("Middleware:findValidTokenById", () => {
  let mockRequest: Partial<Request> & { [REQUEST_TOKEN_ID]: string; [REQUEST_TOKEN]: Token }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      [REQUEST_TOKEN_ID]: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
      [REQUEST_TOKEN]: {
        id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
        userId: "UUU-UUU-UUU-UUU-UUU-UUU-UUU-UUU",
        type: TOKEN_TYPE.VALIDATE,
        used: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("Happy path: Find valid token in DB", async () => {
    await findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockRequest[REQUEST_TOKEN_ID]).toEqual("XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX")
    expect(nextFunction).toHaveBeenCalled()
  })

  it("ValidatedToken doesn't exist in the request, return bad request", async () => {
    mockRequest[REQUEST_TOKEN_ID] = undefined as unknown as string
    await expect(findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      "A valid token is required."
    )
  })

  it("Token is flagged as used, return forbidden", async () => {
    await expect(findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      "Token has already been used."
    )
  })

  it("Token has expired, return forbidden", async () => {
    await expect(findValidTokenById(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow(
      "Token has expired."
    )
  })
})
