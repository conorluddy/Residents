import validateRequestToken from "./validateRequestToken"
import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR } from "../constants/http"
import { isCuid } from "@paralleldrive/cuid2"

describe("validateRequestToken middleware", () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let statusMock: jest.Mock
  let sendMock: jest.Mock

  beforeEach(() => {
    sendMock = jest.fn()
    statusMock = jest.fn(() => ({ send: sendMock }))
    req = {
      headers: {},
      // params: { token: "" },
      // body: { token: "" },
      // query: { token: "" },
    }
    res = {
      status: statusMock,
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return 400 if no token is provided", () => {
    validateRequestToken(req as Request, res as Response, next)

    expect(statusMock).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(sendMock).toHaveBeenCalledWith("Unauthorized: No token provided")
    expect(next).not.toHaveBeenCalled()
  })
})
