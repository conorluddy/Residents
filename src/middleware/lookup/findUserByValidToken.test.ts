import { NextFunction, Request, Response } from "express"
import { ROLES, TOKEN_TYPE } from "../../constants/database"
import { Token, User } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import findUserByValidToken from "./findUserByValidToken"
import { HTTP_CLIENT_ERROR } from "../../constants/http"

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
          user: makeAFakeUser({ role: ROLES.DEFAULT, username: "MrToken" }),
        })
        .mockReturnValueOnce({
          id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
          type: TOKEN_TYPE.MAGIC,
          used: true,
          createdAt: new Date(),
          expiresAt: new Date().setFullYear(new Date().getFullYear() + 1),
          user: makeAFakeUser({ role: ROLES.DEFAULT, username: "MrToken" }),
        })
        .mockReturnValueOnce({
          id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
          type: TOKEN_TYPE.MAGIC,
          used: false,
          createdAt: new Date(),
          expiresAt: new Date(),
          user: makeAFakeUser({ role: ROLES.DEFAULT, username: "MrToken" }),
        }),
    },
  },
}))

describe("Middleware:findUserByValidToken", () => {
  let mockRequest: Partial<Request> & { validatedToken?: string; tokenWithUser?: Partial<Token> }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockDefaultUser: Partial<User>

  beforeAll(() => {
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  beforeEach(() => {
    mockRequest = {
      user: mockDefaultUser,
      validatedToken: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
      tokenWithUser: {},
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("Happy path: Valid token used to find valid user", async () => {
    await findUserByValidToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockRequest.tokenWithUser).toHaveProperty("id", "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX")
    expect(mockRequest.tokenWithUser).toHaveProperty("user", expect.objectContaining({ username: "MrToken" }))
    expect(nextFunction).toHaveBeenCalled()
  })

  it("ValidatedToken doesn't exist in the request, return bad request", async () => {
    mockRequest.validatedToken = undefined
    await findUserByValidToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `Valid token required` })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Token is flagged as used, return forbidden", async () => {
    await findUserByValidToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token has already been used" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Token has expired, return forbidden", async () => {
    await findUserByValidToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token has expired" })
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
