import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import { updateUser } from "./updateUser"

const fakeUser: Partial<User> = makeAFakeUser({})

jest.mock("../../services/index", () => ({
  updateUser: jest.fn().mockImplementationOnce(async () => fakeUser.id),
}))

describe("Controller: UpdateUser", () => {
  let mockRequest: Partial<Request> & { params: { id?: string }; [REQUEST_TARGET_USER_ID]?: string }
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      params: {
        id: "ID",
      },
      [REQUEST_TARGET_USER_ID]: "ID",
      body: {
        username: "test",
        firstName: "updatedFName",
        lastName: "test",
        email: "test@email.com",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Successfully updates a user", async () => {
    await updateUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ${fakeUser.id} updated successfully` })
  })

  it("Responds with Bad Request when IDs are missing", async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: "",
    }
    await expect(
      updateUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow(`User ID is missing in the request.`)
  })

  it("Responds with Forbidden if ID and verified target ID dont match", async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: "NotTheFakerUsersID",
    }

    await expect(
      updateUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow(`You are not allowed to update this user.`)
  })

  it("Responds with Bad Request if no update data is provided", async () => {
    mockRequest.body = {}

    await expect(
      updateUser(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow("No udpate data provided.")
  })
})
