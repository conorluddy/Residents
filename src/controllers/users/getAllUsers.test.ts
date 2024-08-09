import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { getAllUsers } from "./getAllUsers"
import { User } from "../../db/types"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockImplementationOnce(async () => {
      fakeUser = makeAFakeUser({})
      return [fakeUser, fakeUser, fakeUser]
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

  it("Get All Users - Happy path", async () => {
    await getAllUsers(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalledWith([fakeUser, fakeUser, fakeUser])
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })
})
