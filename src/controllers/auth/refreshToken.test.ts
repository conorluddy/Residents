import { refreshToken } from "./refreshToken"
import { Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { ROLES } from "../../constants/database"
import { generateJwt } from "../../utils/generateJwt"
import { User } from "../../db/types"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import { logger } from "../../utils/logger"

const mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  query: {
    tableTokens: {
      findFirst: jest.fn().mockImplementation(() => ({ id: "tok1", userId: "1", user: mockDefaultUser })),
    },
  },
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementationOnce(async () => {
        return [{ id: "tok1" }]
      }),
    }),
  }),
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockImplementation(),
  }),
}))
jest.mock("../../utils/generateJwt", () => ({
  generateJwt: jest.fn().mockReturnValue("testAccessToken"),
}))

describe("Controller: Refresh token", () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>
  let mockDefaultUser: Partial<User>
  let jwt: string
  let xsrf: string

  beforeEach(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    jwt = generateJwt(mockDefaultUser)
    xsrf = generateXsrfToken()
    mockRequest = {
      body: {
        refreshToken: "REFRESHME",
      },
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it("should allow tokens to refresh if existing tokens are legit", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
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

  it.skip("should break if there's no JWT secret defined (todo check this on startup instead)", async () => {
    delete process.env.JWT_TOKEN_SECRET
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal server error" })
  })

  it("should break if there's no refresh token in the request body", async () => {
    delete mockRequest.body?.refreshToken
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Refresh token is required" })
  })

  it("should break if there's no JWT in the header", async () => {
    delete mockRequest.headers?.authorization
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "JWT token is required" })
  })
})
