import { NextFunction, Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { Token } from "../../db/types"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import { resetPasswordWithToken } from "./resetPasswordWithToken"

jest.mock("../../mail/sendgrid", () => ({
  sendMail: jest.fn(),
}))

jest.mock("../../services/index", () => ({
  deleteToken: jest.fn(),
  updateUserPassword: jest
    .fn()
    .mockImplementationOnce(async () => "UID123")
    .mockImplementationOnce(async () => "NOT_SAME"),
}))

describe("Controller: Reset Password With Token", () => {
  let mockRequest: Partial<Request> & { [REQUEST_TOKEN]?: Token }
  let mockResponse: Partial<Response>
  let mockNext: Partial<NextFunction>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      body: {
        password: "__sTR0nGP45$WRD___",
      },
      [REQUEST_TOKEN]: {
        id: "123",
        createdAt: new Date(),
        userId: "UID123",
        type: TOKEN_TYPE.RESET,
        used: false,
        expiresAt: new Date(),
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Happy path: Reset Password With Token", async () => {
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Password successfully updated." })
    expect(logger.info).toHaveBeenCalledWith("Password was reset for USER:UID123")
  })

  it("Unhappy path: Reset Password With Token", async () => {
    await expect(
      resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow(
      "Error updating password for user: UID123, the DB update result should be the same as request ID: NOT_SAME"
    )
  })

  it(`Returns forbidden when missing token`, async () => {
    mockRequest[REQUEST_TOKEN] = undefined
    await expect(
      resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Token missing.")
  })

  it(`Returns forbidden when an incorrect type of token is used`, async () => {
    mockRequest[REQUEST_TOKEN] = {
      ...mockRequest[REQUEST_TOKEN]!,
      type: TOKEN_TYPE.MAGIC,
    }
    await expect(
      resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Invalid token type.")
  })

  it(`Returns bad request when the requested new password fails password strength test`, async () => {
    mockRequest.body.password = "password1"
    await expect(
      resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("Password not strong enough, try harder.")
  })
})
