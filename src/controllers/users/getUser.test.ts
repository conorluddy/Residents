import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { getUser } from "./getUser"
import { User } from "../../db/types"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => {
        fakeUser = makeAFakeUser({})
        return fakeUser
      }),
    }),
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

  it("Get User - Happy path", async () => {
    await getUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(fakeUser)
  })
})
