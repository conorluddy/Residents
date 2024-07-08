import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { deleteUser } from "./deleteUser"
import { User } from "../../db/types"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementationOnce(async () => {
          fakeUser = makeAFakeUser({})
          return [{ updatedId: fakeUser.id }]
        }),
      }),
    }),
  }),
}))

describe("Controller: DeleteUser", () => {
  let mockRequest: Partial<Request> & { targetUserId: string }
  let mockResponse: Partial<Response>
  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      params: {
        id: "ID",
      },
      targetUserId: "ID",
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

  it("Delete User - Happy path", async () => {
    await deleteUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ${fakeUser.id} deleted` })
  })
})
