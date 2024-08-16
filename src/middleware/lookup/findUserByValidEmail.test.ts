import { NextFunction, Request, Response } from "express"
import { ROLES } from "../../constants/database"
import { HTTP_CLIENT_ERROR } from "../../constants/http"
import { SafeUser, User } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import findUserByValidEmail from "./findUserByValidEmail"
import { REQUEST_EMAIL, REQUEST_USER } from "../../types/requestSymbols"

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  query: {
    tableUsers: {
      findFirst: jest
        .fn()
        .mockReturnValueOnce(makeAFakeUser({ role: ROLES.DEFAULT, email: "validated@email.com", username: "MrFake" }))
        .mockReturnValueOnce(null),
    },
  },
}))

describe("Middleware:findUserByValidEmail", () => {
  let mockRequest: Partial<Request> & { [REQUEST_EMAIL]?: string; [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockDefaultUser: SafeUser

  beforeAll(() => {
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  beforeEach(() => {
    mockRequest = {
      user: mockDefaultUser,
      [REQUEST_EMAIL]: "validated@email.com",
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  // Technically RBAC wouldn't let a user with the DEFAULT role access this endpoint,
  // but the middleware should still wotk in isolation and not care about the user's role.
  it("Happy path: Valid email used to find valid user", async () => {
    await findUserByValidEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockRequest[REQUEST_USER]).toHaveProperty("email", "validated@email.com")
    expect(mockRequest[REQUEST_USER]).toHaveProperty("username", "MrFake")
    expect(nextFunction).toHaveBeenCalled()
  })
  it("[REQUEST_EMAIL] doesn't exist in the request", async () => {
    mockRequest[REQUEST_EMAIL] = undefined
    await findUserByValidEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid email" })
    expect(nextFunction).not.toHaveBeenCalled()
  })
  it("user not found when searching by validated email", async () => {
    await findUserByValidEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.NOT_FOUND)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" })
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
