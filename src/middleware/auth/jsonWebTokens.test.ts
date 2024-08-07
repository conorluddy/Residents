import { NextFunction, Request, Response } from "express"
import { ROLES } from "../../constants/database"
import { User } from "../../db/types"
import { generateJwt, JWTUserPayload } from "../../utils/generateJwt"
import { authenticateToken } from "./jsonWebTokens"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"

jest.mock("../../utils/logger")

describe("Middleware:JWT", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockDefaultUser: Partial<User>
  let jwt

  beforeAll(() => {
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  beforeEach(() => {
    jwt = generateJwt(mockDefaultUser)
    mockRequest = {
      user: { role: ROLES.ADMIN, id: "AdminTestUser1" } as JWTUserPayload,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("Happy Path: should allow passthrough if the JWT is verified", () => {
    mockRequest.user = mockDefaultUser
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it("Should reject as unauthorized if there's no token in the request", () => {
    mockRequest.user = mockDefaultUser
    delete mockRequest?.headers?.authorization
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token is required" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Should reject as unauthorized if the token has expired", () => {
    mockRequest.user = mockDefaultUser
    mockRequest.headers = {
      authorization: `Bearer ${generateJwt(mockDefaultUser, "1ms")}`,
    }
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token is invalid or expired" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Should reject as unauthorized if the token has expired", () => {
    jwt = generateJwt(mockDefaultUser, "0ms")
    mockRequest.user = mockDefaultUser
    mockRequest.headers!.authorization = `Bearer ${jwt}`
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token is invalid or expired" })
  })
})
