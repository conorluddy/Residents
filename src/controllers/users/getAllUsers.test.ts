import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { getAllUsers } from "./getAllUsers"
import { User } from "../../db/types"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      limit: jest.fn().mockImplementation(async () => {
        fakeUser = makeAFakeUser({})
        return [fakeUser, fakeUser, fakeUser]
      }),
    }),
  }),
}))

describe("Controller: GetAllUsers", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Gets All Users", async () => {
    await getAllUsers(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith([fakeUser, fakeUser, fakeUser])
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })

  it.skip("Error handling", async () => {
    await getAllUsers(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Error getting users." })
  })
})
