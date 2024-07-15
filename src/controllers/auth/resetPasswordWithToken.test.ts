import { NextFunction, Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { TokenWithUser } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { logger } from "../../utils/logger"
import { resetPasswordWithToken } from "./resetPasswordWithToken"

jest.mock("../../mail/sendgrid", () => ({
  sendMail: jest.fn(),
}))

jest.mock("../../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementationOnce(async () => [{ updatedUserId: "UID123" }]),
      }),
    }),
  }),
}))

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe("Controller: Reset Password With Token", () => {
  let mockRequest: Partial<Request> & { tokenWithUser?: TokenWithUser }
  let mockResponse: Partial<Response>
  let mockNext: Partial<NextFunction>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      body: {
        password: "__sTR0nGP45$WRD___",
      },
      tokenWithUser: {
        id: "123",
        created_at: new Date(),
        user_id: "UID123",
        type: TOKEN_TYPE.RESET,
        used: false,
        expires_at: new Date(),
        user: makeAFakeUser({ email: "bananaman@ireland.ie", id: "UID123" }),
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
    expect(logger.info).toHaveBeenCalledWith("Password successfully reset for bananaman@ireland.ie")
  })

  it(`Returns forbidden when missing token`, async () => {
    mockRequest.tokenWithUser = undefined
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token missing." })
    expect(logger.error).toHaveBeenCalledWith("Missing tokenWithUser data in resetPasswordWithToken controller")
  })

  it(`Returns forbidden when an incorrect type of token is used`, async () => {
    mockRequest.tokenWithUser = {
      ...mockRequest.tokenWithUser!,
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
    mockRequest.tokenWithUser = {
      ...mockRequest.tokenWithUser!,
      user: makeAFakeUser({ id: "DIFFERENT_ID" }),
      user_id: "DIFFERENT_ID",
    }
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error updating password." })
  })
})
