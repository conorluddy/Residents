import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { resetPassword } from "./resetPassword"
import { User } from "../../db/schema"
import { sendMail } from "../../mail/sendgrid"
import { logger } from "../../utils/logger"

let fakeUser: Partial<User>

jest.mock("../../mail/sendgrid", () => ({
  sendMail: jest.fn(),
}))

jest.mock("../../db", () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementationOnce(async () => {
        return [{ id: "tok1" }]
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

describe("Controller: Reset Password", () => {
  let mockRequest: Partial<Request> & { userNoPW: User }
  let mockResponse: Partial<Response>

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      userNoPW: makeAFakeUser({ email: "bananaman@ireland.ie" }),
    }
    mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn().mockImplementation(() => mockResponse),
    }
  })

  it("Reset Password - Happy path", async () => {
    await resetPassword(mockRequest as Request, mockResponse as Response)
    expect(sendMail).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith("Reset email sent to bananaman@ireland.ie, token id: tok1")
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Reset email sent" })
  })
})
