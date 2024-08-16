import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { deleteUser } from "./deleteUser"
import { User } from "../../db/types"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest
          .fn()
          .mockImplementationOnce(async () => {
            fakeUser = makeAFakeUser({})
            return [{ deletedUserId: fakeUser.id }]
          })
          .mockImplementationOnce(async () => {
            throw new Error("Error deleting user")
          }),
      }),
    }),
  }),
}))

describe("Controller: Delete User", () => {
  let mockRequest: Partial<Request> & { [REQUEST_TARGET_USER_ID]: string }
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

  it("Happy path", async () => {
    await deleteUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ${fakeUser.id} deleted` })
  })

  it("Unhappy path - error thrown", async () => {
    await deleteUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `Error deleting user` })
  })

  it("Missing ID", async () => {
    mockRequest.params = {}
    await deleteUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `ID is missing in the request.` })
  })

  it("Missing [REQUEST_TARGET_USER_ID]", async () => {
    mockRequest[REQUEST_TARGET_USER_ID] = ""
    await deleteUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `ID is missing in the request.` })
  })

  it("target user ID doesnt match url param user ID", async () => {
    mockRequest[REQUEST_TARGET_USER_ID] = "PersonToDelete"
    mockRequest.params = { id: "OtherPersonInURL" }
    await deleteUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `You are not allowed to delete this user.` })
  })
})
