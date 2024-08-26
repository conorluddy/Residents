import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { updateUserMeta } from "./updateUserMeta"
import { logger } from "../../utils/logger"
import { REQUEST_TARGET_USER_ID } from "../../types/requestSymbols"

const FAKEID = "123"

jest.mock("../../services/index", () => ({
  updateUserMeta: jest.fn().mockImplementationOnce(async () => FAKEID),
}))

describe("Controller: UpdateUserMeta", () => {
  let mockRequest: Partial<Request> & { params: { id?: string }; [REQUEST_TARGET_USER_ID]?: string }
  let mockResponse: Partial<Response>
  beforeEach(() => {
    mockRequest = {
      params: { id: "ID" },
      [REQUEST_TARGET_USER_ID]: "ID",
      body: { metaItem: "UpdatedMetaItemData" },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Successfully updates user meta", async () => {
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User meta for ${FAKEID} updated successfully` })
  })

  it("Responds with Bad Request when IDs are missing", async () => {
    mockRequest.params = { ...mockRequest.params!, id: "" }
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User ID is missing in the request.` })
  })

  it("Responds with Forbidden if ID and verified target ID dont match", async () => {
    mockRequest.params = { ...mockRequest.params!, id: "NotTheFakerUsersID" }
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `You are not allowed to update this user.` })
  })

  it("Responds with Bad Request if no update data is provided", async () => {
    mockRequest.body = {}
    await updateUserMeta(mockRequest as Request, mockResponse as Response)
    expect(logger.error).toHaveBeenCalledWith(`Missing body data for updating user in request.`)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `No data provided to update the user with.` })
  })
})
