import { NextFunction, Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { resetPassword } from "./resetPassword"
import { sendMail } from "../../mail/sendgrid"
import { logger } from "../../utils/logger"
import { SafeUser } from "../../db/types"
import { REQUEST_EMAIL, REQUEST_USER } from "../../types/requestSymbols"

const user = makeAFakeUser({ email: "bananaman@ireland.ie" })

jest.mock("../../mail/sendgrid", () => ({
  sendMail: jest.fn(),
}))

jest.mock("../../services/index", () => ({
  createToken: jest.fn().mockReturnValueOnce("tok1"),
  getUserByEmail: jest.fn().mockReturnValueOnce(user),
}))

describe("Controller: Reset Password", () => {
  let mockRequest: Partial<Request> & { [REQUEST_EMAIL]?: SafeUser["email"] }
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      [REQUEST_EMAIL]: user.email,
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Happy path - reset email gets sent", async () => {
    await resetPassword(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(sendMail).toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith("Reset email sent to bananaman@ireland.ie, token id: tok1")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Reset email sent" })
  })

  it("missing user data", async () => {
    mockRequest[REQUEST_USER] = undefined
    await expect(
      resetPassword(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("User data missing.")
  })
})
