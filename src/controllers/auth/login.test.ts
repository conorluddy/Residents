import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { makeAFakeUserWithHashedPassword } from "../../test-utils/mockUsers"
import { login } from "./login"

jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => {
        const fakeUser = await makeAFakeUserWithHashedPassword({ password: "testpassword" })
        return [fakeUser]
      }),
    }),
  }),
}))
jest.mock("../../utils/generateJwt", () => ({
  generateJwt: jest.fn().mockReturnValue("fakeToken"),
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
      json: jest.fn().mockReturnThis(),
    }
  })

  it("should allow login with correct username and password", async () => {
    await login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: "fakeToken" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
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
})
