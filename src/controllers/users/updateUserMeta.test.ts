import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { updateUserMeta } from "./updateUserMeta"
import { User } from "../../db/types"
import { logger } from "../../utils/logger"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(async () => {
          fakeUser = makeAFakeUser({})
          return [{ updatedId: fakeUser.id }]
        }),
      }),
    }),
  }),
}))

describe("Controller: UpdateUserMeta", () => {
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
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Successfully updates user meta", async () => {
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User meta for ${fakeUser.id} updated successfully` })
  })

  it("Responds with Bad Request when IDs are missing", async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: "",
    }
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ID is missing in the request.` })
  })

  it("Responds with Forbidden if ID and verified target ID dont match", async () => {
    mockRequest.params = {
      ...mockRequest.params!,
      id: "NotTheFakerUsersID",
    }
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `You are not allowed to update this user.` })
  })

  it("Responds with Bad Request if no update data is provided", async () => {
    mockRequest.body = {}
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenCalledWith(`Missing body data for updating user in request.`)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `No data provided to update the user with.` })
  })
})
