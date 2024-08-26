import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { resetPassword } from "./resetPassword"
import { sendMail } from "../../mail/sendgrid"
import { logger } from "../../utils/logger"
import { SafeUser } from "../../db/types"
import { REQUEST_USER } from "../../types/requestSymbols"

jest.mock("../../mail/sendgrid", () => ({
  sendMail: jest.fn(),
}))

jest.mock("../../services/index", () => ({
  createToken: jest.fn().mockReturnValueOnce("tok1"),
}))

describe("Controller: Reset Password", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      [REQUEST_USER]: makeAFakeUser({ email: "bananaman@ireland.ie" }),
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Happy path - reset email gets sent", async () => {
    await resetPassword(mockRequest as Request, mockResponse as Response)
    expect(sendMail).toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith("Reset email sent to bananaman@ireland.ie, token id: tok1")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Reset email sent" })
  })

  it("missing user data", async () => {
    mockRequest[REQUEST_USER] = undefined
    await resetPassword(mockRequest as Request, mockResponse as Response)
    expect(sendMail).toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith("ResetPassword controller: No user data.")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User data missing." })
  })
})
