import { NextFunction, Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
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
  let mockRequest: Partial<Request> & { tokenWithUser: TokenWithUser }
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
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn().mockImplementation(() => mockResponse),
    }
  })

  it("Happy path: Reset Password With Token", async () => {
    await resetPasswordWithToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Password successfully updated" })
    expect(logger.info).toHaveBeenCalledWith("Password successfully reset for bananaman@ireland.ie")
  })
})
