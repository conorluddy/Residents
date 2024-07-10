import { Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import { User } from "../../db/types"
import { logout } from "./logout"

jest.mock("../../utils/logger")

describe("Controller: Logout", () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      body: {
        username: "MrFake",
        email: "mrfake@gmail.com",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
  })

  it("is not implemented yet", async () => {
    await logout(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Not implemented yet" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })
})
