import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { logout } from "./logout"

jest.mock("../../utils/logger")

describe("Controller: Logout", () => {
  let mockRequest: Partial<Request> & { user: Partial<User> }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      user: {
        id: "123",
        username: "MrFake",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it("is not implemented yet", async () => {
    await logout(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Logged out - Come back soon!" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })
})
