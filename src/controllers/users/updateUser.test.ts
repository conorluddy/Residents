import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { updateUser } from "./updateUser"
import { User } from "../../db/types"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

const fakeUser: Partial<User> = makeAFakeUser({})

jest.mock("../../services/index", () => ({
  updateUser: jest.fn().mockImplementationOnce(async () => fakeUser.id),
}))

describe("Controller: UpdateUser", () => {
  let mockRequest: Partial<Request> & { params: { id?: string }; [REQUEST_TARGET_USER_ID]?: string }
  let mockResponse: Partial<Response>
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
    await updateUser(mockRequest as Request, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ${fakeUser.id} updated successfully` })
  })

  it("Responds with Bad Request when IDs are missing", async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: "",
    }
    await updateUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ID is missing in the request.` })
  })

  it("Responds with Forbidden if ID and verified target ID dont match", async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: "NotTheFakerUsersID",
    }
    await updateUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `You are not allowed to update this user.` })
  })

  it("Responds with Bad Request if no update data is provided", async () => {
    mockRequest.body = {}
    await updateUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `No data provided to update the user with.` })
  })
})
