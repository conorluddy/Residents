import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { getSelf } from "./getSelf"
import { User } from "../../db/types"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => {
        fakeUser = makeAFakeUser({ id: "SELF_ID" })
        return [fakeUser]
      }),
    }),
  }),
}))

describe("Controller: GetSelf", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      user: {
        id: "SELF_ID",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Get Self - Happy path", async () => {
    await getSelf(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(fakeUser)
  })
})
