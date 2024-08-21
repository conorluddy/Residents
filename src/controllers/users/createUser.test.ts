import { Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { createUser } from "./createUser"

jest.mock("../../services/index", () => ({
  createToken: jest.fn(),
  createUserMeta: jest.fn(),
  createUser: jest.fn().mockImplementation(async () => "123"),
}))

describe("Controller: CreateUser", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
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
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User registered." })
  })

  // Test these in the service tests
  // it("Create User - Weak password", async () => {
  //   mockRequest.body.password = "weak"
  //   await createUser(mockRequest as Request, mockResponse as Response)
  //   expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
  //   expect(mockResponse.json).toHaveBeenCalledWith({ message: "Password not strong enough, try harder." })
  // })

  // it("Create User - Invalid email", async () => {
  //   mockRequest.body.email = "invalid-email"
  //   await createUser(mockRequest as Request, mockResponse as Response)
  //   expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
  //   expect(mockResponse.json).toHaveBeenCalledWith({ message: "Email needs to be a valid email." })
  // })
})
