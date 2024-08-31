import { NextFunction, Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { getAllUsers } from "./getAllUsers"
import { User } from "../../db/types"

let fakeUser: Partial<User> = makeAFakeUser({ id: "123" })

jest.mock("../../services/index", () => ({
  getAllUsers: jest
    .fn()
    .mockImplementationOnce(() => [fakeUser, fakeUser, fakeUser])
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(() => {
      throw new Error("S.N.A.F.U")
    }),
}))

describe("Controller: GetAllUsers", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext = jest.fn().mockReturnThis()

  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Gets All Users", async () => {
    await getAllUsers(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.json).toHaveBeenCalledWith([fakeUser, fakeUser, fakeUser])
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })

  it("Gets No Users", async () => {
    await getAllUsers(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.json).toHaveBeenCalledWith([])
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })

  it("Handles an error from the service", async () => {
    await expect(
      getAllUsers(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow(`S.N.A.F.U`)
  })
})
