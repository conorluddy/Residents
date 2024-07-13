import express from "express"
import request from "supertest"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import CONTROLLERS from "../../controllers"
import { User } from "../../db/types"
import createUserRoute from "../../routes/users/createUser"
import { makeAFakeUser } from "../../test-utils/mockUsers"

CONTROLLERS.USER.createUser = jest.fn(async (req, res) => {
  return res.status(200).send({ message: "User created successfully" })
})

let fakeUser: User
jest.mock("../../db", () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementationOnce(async () => {
        fakeUser = await makeAFakeUser({ password: "$TR0ngP@$$W0rDz123!" })
        return [fakeUser]
      }),
    }),
  }),
}))

const app = express()
app.use(express.json())
app.use("/", createUserRoute)

describe("POST /register", () => {
  it("should call the register controller with valid data", async () => {
    const requestBody = {
      username: "testuser",
      password: "password123!@$1P",
      email: "testuser@gmail.com",
    }
    const response = await request(app).post("/register").send(requestBody)
    expect(response.body.message).toBe("User registered.")
    expect(response.status).toBe(HTTP_SUCCESS.CREATED)
  })

  it("should return BAD_REQUEST with invalid email", async () => {
    const requestBody = {
      username: "testuser",
      password: "password123",
      email: "invalid-email",
    }
    const response = await request(app).post("/register").send(requestBody)
    expect(response.status).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(response.body).toBe("Invalid email address")
  })

  it("should return BAD_REQUEST when email is missing", async () => {
    const requestBody = {
      username: "testuser",
      password: "password123",
      // Missing email
    }
    const response = await request(app).post("/register").send(requestBody)
    expect(response.status).toBe(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(response.body).toBe("Email is required")
  })
})
