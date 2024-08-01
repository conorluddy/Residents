import { refreshToken } from "./refreshToken"
import { Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { ROLES, TOKEN_TYPE } from "../../constants/database"
import { generateJwt } from "../../utils/generateJwt"
import { User } from "../../db/types"

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  query: {
    tableTokens: {
      findFirst: jest.fn().mockImplementation(() => ({ user: makeAFakeUser({ role: ROLES.DEFAULT }) })),
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

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
    jwt = generateJwt(mockDefaultUser)
  })

  beforeEach(() => {
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
    // expect(mockResponse.cookie).toHaveBeenCalledWith("refreshToken", "token123", {
    //   httpOnly: true,
    //   maxAge: 604800000,
    //   sameSite: "strict",
    //   secure: false,
    // })
  })
})
