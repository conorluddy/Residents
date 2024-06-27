import { createUser } from "./createUser"
import { Request, Response } from "express"
import { createHash } from "../../utils/crypt"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"

jest.mock("../../../src/utils/crypt")
jest.mock("../../../src/db")
jest.mock("../../../src/utils/logger")

describe("createUser controller", () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: jest.Mock
  let sendMock: jest.Mock

  beforeEach(() => {
    sendMock = jest.fn()
    statusMock = jest.fn(() => ({ send: sendMock }))
    req = {
      body: {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "password123",
      },
    }
    res = {
      status: statusMock,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should create a user successfully", async () => {
    ;(createHash as jest.Mock).mockResolvedValue("hashedpassword")
    ;(db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{}]),
    })

    await createUser(req as Request, res as Response)

    expect(createHash).toHaveBeenCalledWith("password123")
    expect(db.insert).toHaveBeenCalledWith(tableUsers)
    expect(statusMock).toHaveBeenCalledWith(HTTP_SUCCESS.CREATED)
    expect(sendMock).toHaveBeenCalledWith("User registered")
  })

  it("should handle errors during user creation", async () => {
    ;(createHash as jest.Mock).mockResolvedValue("hashedpassword")
    ;(db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockRejectedValue(new Error("DB error")),
    })

    await createUser(req as Request, res as Response)

    expect(logger.error).toHaveBeenCalledWith(new Error("DB error"))
    expect(statusMock).toHaveBeenCalledWith(
      HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR
    )
    expect(sendMock).toHaveBeenCalledWith("Error registering user")
  })
})
