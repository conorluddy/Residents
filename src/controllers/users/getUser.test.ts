import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { getUser } from "./getUser"

let fakeUser: Partial<User>

jest.mock("../../services/user/getUserByID", () => ({
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
      throw new Error("DB error.")
    }),
}))

describe("Controller: GetUser", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()

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
    await getUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(fakeUser)
  })

  it("Missing User ID", async () => {
    mockRequest.params = {}
    await expect(getUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)).rejects.toThrow(
      "User ID is missing."
    )
  })

  it("User not found", async () => {
    await expect(getUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)).rejects.toThrow(
      "User not found."
    )
  })

  it("Error handling", async () => {
    await expect(getUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)).rejects.toThrow(
      "DB error."
    )
  })
})
