import { refreshToken } from "./refreshToken"
import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { ROLES } from "../../constants/database"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { User } from "../../db/types"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import { logger } from "../../utils/logger"
import jwt from "jsonwebtoken"
import { getUserByID } from "../../services/user/getUser"

const mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })

jest.mock("jsonwebtoken")
jest.mock("../../utils/generateJwt", () => ({
  generateJwtFromUser: jest.fn().mockReturnValue("testAccessToken"),
}))

jest.mock("../../services/index", () => ({
  getUserByID: jest.fn().mockImplementation(() => mockDefaultUser),
  deleteToken: jest.fn().mockImplementation(() => "123"),
  createToken: jest.fn().mockImplementation(() => ({ id: "tok1" })),
  getToken: jest
    .fn()
    // Happy path
    .mockImplementationOnce(() => ({
      id: "tok0",
      userId: mockDefaultUser.id,
    }))
    .mockImplementationOnce(() => undefined)
    .mockImplementationOnce(() => ({
      id: "tok1",
      userId: "456",
    }))
    .mockImplementationOnce(() => ({
      id: "tok3",
      used: true,
      userId: mockDefaultUser.id,
    }))
    .mockImplementationOnce(() => ({
      id: "tok2",
      expiresAt: new Date(Date.now() - 1000),
      userId: mockDefaultUser.id,
    })),
}))

// Remove this and use the mocked service instead
jest.mock("../../db", () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementationOnce(async () => {
        return [{ id: "tok1" }]
      }),
    }),
  }),
}))

describe("Controller: Refresh token: Happy path", () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>
  let jwToken: string
  let xsrf: string
  let jwtDecodeSpy: jest.MockedFunction<typeof jwt.decode>

  beforeAll(() => {
    jwtDecodeSpy = jest.spyOn(jwt, "decode") as jest.MockedFunction<typeof jwt.decode>
    jwtDecodeSpy.mockReturnValue({ id: mockDefaultUser.id })
  })

  beforeEach(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    jwToken = generateJwtFromUser(mockDefaultUser)
    xsrf = generateXsrfToken()
    mockRequest = {
      body: { refreshToken: "REFRESHME" },
      headers: { authorization: `Bearer ${jwt}` },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    }
  })

  it("should allow tokens to refresh if existing tokens are legit", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: "testAccessToken" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.cookie).toHaveBeenCalledTimes(2)
    expect(mockResponse.cookie).toHaveBeenNthCalledWith(1, "refreshToken", "tok1", {
      httpOnly: true,
      maxAge: 604800000,
      sameSite: "strict",
      secure: false,
    })
    expect(mockResponse.cookie).toHaveBeenLastCalledWith("xsrfToken", xsrf, {
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
      body: {
        refreshToken: "REFRESHME",
      },
      headers: {
        authorization: `Bearer ${jwToken}`,
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it("there's no refresh token in the request body", async () => {
    delete mockRequest.body?.refreshToken
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Refresh token is required" })
  })

  it("there's no JWT in the header", async () => {
    delete mockRequest.headers?.authorization
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "JWT token is required" })
  })
  it("the token isnt found in the database", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenCalledWith("Refresh token not found: REFRESHME")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token not valid." })
  })
  it("the token user doesn't match the JWT user", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenCalledWith("Token x user mismatch: 456")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN) // Forbidden
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token not valid." })
  })
  it("the token has a USED flag set", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenNthCalledWith(3, `Attempt to use a used refresh token for USER${mockDefaultUser.id}`)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token not valid." })
  })
  it("the token has expired", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenCalledWith(`Attempt to use an expired refresh token: REFRESHME`)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token has expired." })
  })
  it("logs when an error is thrown", async () => {
    delete mockRequest.headers
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error refreshing access token." })
  })
})
