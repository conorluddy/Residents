import { Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { makeAFakeUserWithHashedPassword } from "../../test-utils/mockUsers"
import { logger } from "../../utils/logger"
import { login } from "./login"

jest.mock("../../services/index", () => ({
  getUserByUsername: jest
    .fn()
    .mockImplementationOnce(async () => makeAFakeUserWithHashedPassword({ password: "testpassword" })),
  getUserByEmail: jest
    .fn()
    .mockImplementationOnce(async () => makeAFakeUserWithHashedPassword({ password: "testpassword" })),
  getUserPasswordHash: jest
    .fn()
    .mockImplementationOnce(async () => (await makeAFakeUserWithHashedPassword({ password: "testpassword" })).password),
  createToken: jest.fn().mockImplementation(async () => ({
    userId: "123",
    id: "token123",
    type: TOKEN_TYPE.REFRESH,
    used: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  })),
}))

jest.mock("../../utils/generateJwt", () => ({
  generateJwtFromUser: jest.fn().mockReturnValue("fakeToken"),
}))

describe("Controller: Login", () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
  })

  beforeEach(() => {
    mockRequest = {
      body: {
        username: "MrFake",
        email: "mrfake@gmail.com",
        password: "testpassword",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it("should allow login with correct username and password", async () => {
    await login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: "fakeToken" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.cookie).toHaveBeenCalledWith("refreshToken", "token123", {
      httpOnly: true,
      maxAge: 604800000,
      sameSite: "strict",
      secure: false,
    })
  })

  it("should reject login with incorrect username", async () => {
    mockRequest.body.username = "MrsFake"
    mockRequest.body.password = "testpassword"
    await login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Nope." })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
  })

  it("should reject login with incorrect password", async () => {
    mockRequest.body.username = "MrFake"
    mockRequest.body.password = "wrongpassword"
    await login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Nope." })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
  })

  it("should reject login with missing username/password", async () => {
    mockRequest.body.username = null
    mockRequest.body.email = null
    mockRequest.body.password = "testpassword"
    await login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Username or email is required" })
  })

  it("should reject login with missing password", async () => {
    mockRequest.body.username = "MrFake"
    mockRequest.body.password = null
    await login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Password is required" })
  })

  it("should reject login with invalid email address", async () => {
    mockRequest.body.username = null
    mockRequest.body.email = "notanemailaddress"
    mockRequest.body.password = "testpassword"
    await login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid email address" })
  })

  it.skip("should catch errors", async () => {
    delete mockRequest.cookies
    await login(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenCalledWith("x")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error logging in." })
  })
})
