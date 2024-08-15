import { Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { PublicUser } from "../../db/types"
import { makeAFakeSafeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import { googleCallback } from "./googleCallback"

describe("Controller: GoogleCallback", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]: PublicUser }
  let mockResponse: Partial<Response>

  beforeAll(() => {
    process.env.JWT_TOKEN_SECRET = "TESTSECRET"
  })

  beforeEach(() => {
    mockRequest = { [REQUEST_USER]: makeAFakeSafeUser({ username: "Hackerman" }) }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("has a gaping security hole", async () => {
    await googleCallback(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })
})
