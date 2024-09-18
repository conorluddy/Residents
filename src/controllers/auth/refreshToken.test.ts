import { refreshToken } from "./refreshToken"
import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { ROLES } from "../../constants/database"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { User } from "../../db/types"
import { logger } from "../../utils/logger"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import jwt from "jsonwebtoken"
import { RESIDENT_TOKEN } from "../../constants/keys"

const mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })

jest.mock("jsonwebtoken")
jest.mock("../../utils/generateJwt", () => ({
  generateJwtFromUser: jest.fn().mockReturnValue("testAccessToken"),
}))

jest.mock("../../services/index", () => ({
  getUserById: jest.fn().mockImplementation(async () => mockDefaultUser),
  deleteRefreshTokensByUserId: jest.fn().mockImplementation(async () => "123"),
  createToken: jest.fn().mockImplementation(async () => "tok1"),
  deleteToken: jest.fn().mockImplementation(async () => "123"),
  getToken: jest
    .fn()
    .mockImplementationOnce(async () => ({
      id: "tok0",
      userId: mockDefaultUser.id,
    }))
    .mockImplementationOnce(async () => undefined)
    .mockImplementationOnce(async () => ({
      id: "tok1",
      userId: "456",
    }))
    .mockImplementationOnce(async () => ({
      id: "tok3",
      used: true,
      userId: mockDefaultUser.id,
    }))
    .mockImplementationOnce(async () => ({
      id: "tok2",
      expiresAt: new Date(Date.now() - 1000),
      userId: mockDefaultUser.id,
    })),
}))

describe("Controller: Refresh token: Happy path", () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()
  let jwtDecodeSpy: jest.MockedFunction<typeof jwt.decode>
  let xsrf: string
  let jwToken: string

  beforeAll(() => {
    jwtDecodeSpy = jest.spyOn(jwt, "decode") as jest.MockedFunction<typeof jwt.decode>
    jwtDecodeSpy.mockReturnValue({ id: mockDefaultUser.id })
  })

  beforeEach(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    jwToken = generateJwtFromUser(mockDefaultUser)
    xsrf = generateXsrfToken()
    mockRequest = {
      body: {},
      headers: { authorization: `Bearer ${jwt}` },
      cookies: { refreshToken: "REFRESHME", [RESIDENT_TOKEN]: mockDefaultUser.id },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    }
  })

  it("should allow tokens to refresh if existing tokens are legit", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith({ token: "testAccessToken" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.cookie).toHaveBeenCalledTimes(3)
    expect(mockResponse.cookie).toHaveBeenNthCalledWith(1, "refreshToken", "tok1", {
      httpOnly: true,
      maxAge: 604800000,
      sameSite: "strict",
      secure: false,
    })
    expect(mockResponse.cookie).toHaveBeenNthCalledWith(2, "xsrfToken", xsrf, {
      httpOnly: true,
      maxAge: 604800000,
      sameSite: "strict",
      secure: false,
    })
    expect(mockResponse.cookie).toHaveBeenNthCalledWith(3, "residentToken", mockDefaultUser.id, {
      httpOnly: true,
      maxAge: 604800000,
      sameSite: "strict",
      secure: false,
    })
  })
})

describe("Should return errors if", () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()
  let jwToken: string
  let jwtDecodeSpy: jest.MockedFunction<typeof jwt.decode>
  const otherMockDefaultUser = makeAFakeUser({ role: ROLES.MODERATOR })

  beforeAll(() => {
    // jest.resetAllMocks()
    jwtDecodeSpy = jest.spyOn(jwt, "decode") as jest.MockedFunction<typeof jwt.decode>
    jwtDecodeSpy.mockReturnValue({ ...mockDefaultUser })
  })

  beforeEach(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    jwToken = generateJwtFromUser(otherMockDefaultUser)
    mockRequest = {
      body: {},
      headers: {
        authorization: `Bearer ${jwToken}`,
      },
      cookies: { refreshToken: "REFRESHME", [RESIDENT_TOKEN]: mockDefaultUser.id },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it("there's no refresh token in the request body", async () => {
    delete mockRequest.cookies?.refreshToken
    await expect(
      refreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Refresh token is required")
  })

  it("there's no UserId in the cookies", async () => {
    delete mockRequest.cookies?.[RESIDENT_TOKEN]
    await expect(
      refreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Refresh token counterpart is required.")
  })
  it("the token isnt found in the database", async () => {
    await expect(
      refreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Token not found.")
  })
  it("the token user doesn't match the JWT user", async () => {
    await expect(
      refreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Token user not valid.")
  })
  it("the token has a USED flag set", async () => {
    await expect(
      refreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Token has already been used.")
  })
  it("the token has expired", async () => {
    await expect(
      refreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Token has expired.")
  })
})
