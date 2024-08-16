import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { getUser } from "./getUser"
import { User } from "../../db/types"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../services/user/getUser", () => ({
  getUserByID: jest
    .fn()
    .mockImplementationOnce(async () => {
      fakeUser = makeAFakeUser({})
      return fakeUser
    })
    .mockImplementationOnce(async () => {
      return undefined
    })
    .mockImplementationOnce(async () => {
      throw new Error("DB error")
    }),
}))

describe("Controller: GetUser", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      params: {
        id: "ID",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Happy path", async () => {
    await getUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(fakeUser)
  })

  it("Missing User ID", async () => {
    mockRequest.params = {}
    // Can't really happen because of the route definition, but just for cov
    await getUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "ID is missing in the request." })
  })

  it("User not found", async () => {
    await getUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.NOT_FOUND)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found." })
  })

  it("Error handling", async () => {
    await getUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error getting user." })
  })
})
