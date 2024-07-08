import { Request, Response } from "express"
import { makeAFakeUserWithHashedPassword } from "../../test-utils/mockUsers"
import { HTTP_SUCCESS } from "../../constants/http"
import { createUser } from "./createUser"
import { User } from "../../db/types"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementationOnce(async () => {
        fakeUser = await makeAFakeUserWithHashedPassword({ password: "$TR0ngP@$$W0rDz123!" })
        return [fakeUser]
      }),
    }),
  }),
}))

describe("Controller: CreateUser", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  beforeAll(() => {})
  beforeEach(() => {
    mockRequest = {
      body: {
        username: "FakeUser",
        firstName: "Fake",
        lastName: "User",
        email: "fakeuser@fake.com",
        password: "$TR0ngP@$$W0rDz123!",
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it("Create User - Happy path", async () => {
    await createUser(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.CREATED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `User registered` })
  })
})
