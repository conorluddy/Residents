import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { getSelf } from "./getSelf"
import { User } from "../../db/types"
import { logger } from "../../utils/logger"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest
        .fn()
        .mockImplementationOnce(async () => {
          fakeUser = makeAFakeUser({ id: "SELF_ID" })
          return [fakeUser]
        })
        .mockImplementationOnce(async () => {
          return []
        })
        .mockImplementationOnce(async () => {
          throw new Error("DB error")
        }),
    }),
  }),
}))

describe("Controller: GetSelf", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

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

  it("Happy path", async () => {
    await getSelf(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    const { password, ...shareableUser } = fakeUser
    expect(mockResponse.json).toHaveBeenCalledWith(shareableUser)
  })

  it("Missing ID is handled", async () => {
    mockRequest.user = {}
    await getSelf(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User ID is missing in the request." })
  })

  it("User not found in DB (shouldnt happen for getSelf but o/)", async () => {
    await getSelf(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.NOT_FOUND)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found." })
  })

  it("Unhappy path", async () => {
    await getSelf(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenCalledWith(Error("DB error"))
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal server error while getting user." })
  })
})
