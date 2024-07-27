import { Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import { User } from "../../db/types"
import { refreshToken } from "./refreshToken"

jest.mock("../../utils/logger")

describe("Controller: Refresh token", () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = { body: { token: "123" } }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("NOT IMPLEMENTED YET: TODO", async () => {
    await refreshToken(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Not implemented yet" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })
})
