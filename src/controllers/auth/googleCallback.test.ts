import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { googleCallback } from "./googleCallback"
import { logger } from "../../utils/logger"
import { makeAFakeUser } from "../../test-utils/mockUsers"

jest.mock("../../utils/logger")
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe("Controller: GoogleCallback", () => {
  let mockRequest: Partial<Request> & { user: Partial<User> }
  let mockResponse: Partial<Response>

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
  })

  beforeEach(() => {
    mockRequest = { user: makeAFakeUser({ username: "Hackerman" }) }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
  })

  it("has a gaping security hole", async () => {
    await googleCallback(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })
})
