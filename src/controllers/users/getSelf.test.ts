import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { SafeUser, User } from "../../db/types"
import { makeAFakeSafeUser, makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import { getSelf } from "./getSelf"

let fakeUser: Partial<User>

jest.mock("../../services/index", () => ({
  getUserById: jest
    .fn()
    .mockImplementationOnce(async () => {
      fakeUser = makeAFakeUser({ id: "SELF_ID" })
      return fakeUser
    })
    .mockImplementationOnce(async () => {
      return undefined
    })
    .mockImplementationOnce(async () => {
      throw new Error("DB error")
    }),
}))

describe("Controller: GetSelf", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]?: SafeUser }
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()

  beforeEach(() => {
    mockRequest = {
      [REQUEST_USER]: makeAFakeSafeUser({ id: "SELF_ID" }),
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Happy path", async () => {
    await getSelf(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith(fakeUser)
  })

  it("Missing ID is handled", async () => {
    mockRequest[REQUEST_USER] = undefined
    await expect(getSelf(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)).rejects.toThrow(
      "User ID is missing."
    )
  })

  it("User not found in DB (shouldnt happen for getSelf but o/)", async () => {
    await expect(getSelf(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)).rejects.toThrow(
      "User not found."
    )
  })
})
