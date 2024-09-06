import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { SafeUser } from "../../db/types"
import { logout } from "./logout"
import { REQUEST_USER } from "../../types/requestSymbols"
import { makeAFakeSafeUser } from "../../test-utils/mockUsers"

jest.mock("../../services/index", () => ({
  deleteRefreshTokensByUserId: jest.fn().mockImplementation(() => "123"),
}))

describe("Controller: Logout", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()

  beforeEach(() => {
    mockRequest = {
      [REQUEST_USER]: makeAFakeSafeUser({
        id: "123",
        username: "MrFake",
      }),
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it("Throws an error if missing the user data", async () => {
    mockRequest[REQUEST_USER] = undefined
    await expect(logout(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)).rejects.toThrow(
      "User ID is missing."
    )
  })

  it("logs out a user by deleting any of their refresh tokens", async () => {
    await logout(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Logged out from API. Clear your client tokens." })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.cookie).toHaveBeenCalledWith("refreshToken", "", {
      httpOnly: true,
      expires: expect.any(Date),
      sameSite: "strict",
      secure: false,
    })
  })
})
