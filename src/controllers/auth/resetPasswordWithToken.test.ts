import { NextFunction, Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { Token } from "../../db/types"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import { resetPasswordWithToken } from "./resetPasswordWithToken"

jest.mock("../../mail/sendgrid", () => ({
  sendMail: jest.fn(),
}))

jest.mock("../../services/index", () => ({
  updateUser: jest
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
    expect(logger.info).toHaveBeenCalledWith("Password successfully reset for USERUID123")
  })

  it("Unhappy path: Reset Password With Token", async () => {
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error updating password." })
    expect(logger.error).toHaveBeenCalledWith(
      "Error updating password for user: UID123, db-update result (should be empty or same as request ID): NOT_SAME"
    )
  })

  it(`Returns forbidden when missing token`, async () => {
    mockRequest[REQUEST_TOKEN] = undefined
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token missing." })
    expect(logger.error).toHaveBeenCalledWith("Missing token data in resetPasswordWithToken controller")
  })

  it(`Returns forbidden when an incorrect type of token is used`, async () => {
    mockRequest[REQUEST_TOKEN] = {
      ...mockRequest[REQUEST_TOKEN]!,
      type: TOKEN_TYPE.MAGIC,
    }
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid token type." })
    expect(logger.error).toHaveBeenCalledWith(
      "An incorrect token type was used in an attempt to reset a password: TID:123"
    )
  })

  it(`Returns bad request when the requested new password fails password strength test`, async () => {
    mockRequest.body.password = "password1"
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Password not strong enough, try harder." })
    expect(logger.error).toHaveBeenCalledWith("Password reset attempt failed with weak password.")
  })

  it(`Returns a server error when IDs dont match.`, async () => {
    mockRequest[REQUEST_TOKEN] = {
      ...mockRequest[REQUEST_TOKEN]!,
      userId: "DIFFERENT_ID",
    }
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error updating password." })
  })
})
