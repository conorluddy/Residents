import { NextFunction, Request, Response } from "express"
import { ROLES } from "../../constants/database"
import { HTTP_CLIENT_ERROR } from "../../constants/http"
import { PublicUser, User } from "../../db/types"
import { makeAFakeSafeUser, makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { authenticateToken } from "./jsonWebTokens"

jest.mock("../../utils/logger")

describe("Middleware:JWT", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]: PublicUser }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockDefaultUser: User
  let jwt

  beforeAll(() => {
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  beforeEach(() => {
    jwt = generateJwtFromUser(mockDefaultUser)
    mockRequest = {
      [REQUEST_USER]: makeAFakeSafeUser({ id: "AdminTestUser1", role: ROLES.ADMIN }),
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
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    // expect(logger.warn).toHaveBeenCalledWith("")

    expect(nextFunction).toHaveBeenCalled()
  })

  it("Should reject as unauthorized if there's no token in the request", () => {
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    delete mockRequest?.headers?.authorization
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token is required" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Should reject as unauthorized if the token has expired", () => {
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    mockRequest.headers = {
      authorization: `Bearer ${generateJwtFromUser(mockDefaultUser, "1ms")}`,
    }
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token is invalid or expired" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Should reject as unauthorized if the token has expired", () => {
    jwt = generateJwtFromUser(mockDefaultUser, "0ms")
    mockRequest[REQUEST_USER] = makeAFakeSafeUser(mockDefaultUser)
    mockRequest.headers!.authorization = `Bearer ${jwt}`
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token is invalid or expired" })
  })
})
