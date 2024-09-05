import { NextFunction, Request, Response } from "express"
import { ROLES, TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { PublicUser, Token } from "../../db/types"
import { makeAFakeSafeUser } from "../../test-utils/mockUsers"
import { REQUEST_TOKEN, REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import { validateAccount } from "./validateAccount"
import { TIMESPAN } from "../../constants/time"

const mockDefaultUser = makeAFakeSafeUser({ role: ROLES.DEFAULT })
const mockToken: Token = {
  id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
  type: TOKEN_TYPE.VALIDATE,
  used: false,
  userId: mockDefaultUser.id,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
}

jest.mock("../../services/index", () => ({
  deleteToken: jest.fn().mockImplementation(async () => "123"),
  getToken: jest.fn().mockImplementationOnce(async () => mockToken),
  updateUserRole: jest.fn().mockImplementation(async () => mockDefaultUser.id),
  updateUserStatus: jest.fn().mockImplementation(async () => mockDefaultUser.id),
}))

jest.mock("../../utils/generateJwt", () => ({
  generateJwtFromUser: jest.fn().mockReturnValue({}),
}))

describe("Controller: Validate Account", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]: PublicUser; [REQUEST_TOKEN]?: Token }
  let mockResponse: Partial<Response>
  let mockNext: Partial<NextFunction>

  beforeEach(() => {
    mockRequest = {
      params: { tokenId: mockToken.id, userId: mockDefaultUser.id },
      [REQUEST_USER]: mockDefaultUser,
      [REQUEST_TOKEN]: mockToken,
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Validates a users account when the token is found and matches the user", async () => {
    await validateAccount(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(logger.error).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith(`User ${mockDefaultUser.id} validated.`)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Account validated." })
  })

  it(`Returns forbidden when missing token`, async () => {
    mockRequest[REQUEST_TOKEN] = undefined
    await expect(
      validateAccount(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Validation token missing.")
  })

  it(`Returns forbidden when missing userId from URL`, async () => {
    mockRequest.params = { tokenId: "TOKEN001" }
    await expect(
      validateAccount(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Invalid user data.")
  })

  it(`Returns forbidden when missing userId from URL`, async () => {
    mockRequest[REQUEST_TOKEN] = {
      id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
      type: TOKEN_TYPE.MAGIC,
      used: false,
      userId: mockDefaultUser.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
    }
    await expect(
      validateAccount(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Validation token invalid.")
  })

  it(`Returns forbidden when the token ID doesnt match the user ID`, async () => {
    mockRequest[REQUEST_TOKEN] = {
      id: "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX",
      type: TOKEN_TYPE.VALIDATE,
      used: false,
      userId: "NOT_THE_SAME",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
    }
    await expect(
      validateAccount(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Validation token invalid.")
  })
})
