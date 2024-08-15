import { Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { validateAccount } from "./validateAccount"
import { makeAFakeSafeUser, makeAFakeUser } from "../../test-utils/mockUsers"
import { ROLES } from "../../constants/database"
import { logger } from "../../utils/logger"
import { REQUEST_USER } from "../../types/requestSymbols"
import { SafeUser } from "../../db/types"

const mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock("../../db", () => ({
  query: {
    tableTokens: {
      findFirst: jest.fn().mockImplementation(() => ({
        id: "TOKEN001",
        userId: mockDefaultUser.id,
        user: mockDefaultUser,
      })),
    },
  },
  //
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementationOnce(async () => {
          return [{ id: "tok1" }]
        }),
      }),
    }),
  }),
  //
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnValue({}),
  }),
}))

jest.mock("../../utils/generateJwt", () => ({
  generateJwt: jest.fn().mockReturnValue({}),
}))

describe("Controller: Validate Account", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]: SafeUser }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      params: {
        tokenId: "TOKEN001",
        userId: mockDefaultUser.id,
      },
      [REQUEST_USER]: makeAFakeSafeUser({ id: mockDefaultUser.id }),
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Validates a users account when the token is found and matches the user", async () => {
    await validateAccount(mockRequest as Request, mockResponse as Response)
    expect(logger.info).toHaveBeenCalledWith(`User ${mockDefaultUser.id} validated.`)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Account validated." })
  })
})
