import { NextFunction, Request, Response } from "express"
import { ROLES } from "../constants/database"
import { HTTP_CLIENT_ERROR } from "../constants/http"
import { User } from "../db/types"
import { makeAFakeUser } from "../test-utils/mockUsers"
import findUserByValidEmail from "./findUserByValidEmail"

jest.mock("../utils/logger")
jest.mock("../db", () => ({
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
  let mockRequest: Partial<Request> & { validatedEmail?: string; userNoPW?: Partial<User> }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockDefaultUser: Partial<User>

  beforeAll(() => {
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
  })

  beforeEach(() => {
    mockRequest = {
      user: mockDefaultUser,
      validatedEmail: "validated@email.com",
    }
    mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn().mockImplementation(() => mockResponse),
    }
    nextFunction = jest.fn()
  })

  // Technically RBAC wouldn't let a user with the DEFAULT role access this endpoint,
  // but the middleware should still wotk in isolation and not care about the user's role.
  it("Happy path: Valid email used to find valid user", async () => {
    await findUserByValidEmail(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockRequest.userNoPW).toHaveProperty("email", "validated@email.com")
    expect(mockRequest.userNoPW).toHaveProperty("username", "MrFake")
    expect(nextFunction).toHaveBeenCalled()
  })
  it("validatedEmail doesn't exist in the request", async () => {
    mockRequest.validatedEmail = undefined
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
