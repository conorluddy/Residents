import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { User } from "../../db/types"
import { magicLogin } from "./magicLogin"

describe("Controller: Magic Login", () => {
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

  it("should allow magicLogin when implemented", async () => {
    await magicLogin(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Not implemented yet" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })

  it("should bomb out early if you dont provide an email address", async () => {
    delete mockRequest.body.email
    await magicLogin(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Email is required" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
  })
})
