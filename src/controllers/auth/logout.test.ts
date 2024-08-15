import { Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { SafeUser } from "../../db/types"
import { logout } from "./logout"
import { REQUEST_USER } from "../../types/requestSymbols"
import { makeAFakeSafeUser } from "../../test-utils/mockUsers"

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockImplementation(),
  }),
}))

describe("Controller: Logout", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>

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

  it("logs out a user by deleting any of their refresh tokens", async () => {
    await logout(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Logged out - Come back soon!" })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })
})
