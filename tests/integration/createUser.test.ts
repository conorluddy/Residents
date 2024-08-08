import request from "supertest"
import { app } from "../../src" // Adjust the path to import your Express app
import { dbClient } from "../../src/db"

describe("POST /users/register", () => {
  beforeAll(async () => {
    await dbClient.connect()
  })

  afterAll(async () => {
    await dbClient.end()
  })

  beforeEach(async () => {
    await dbClient.query("DELETE FROM users")
  })

  it("should create a new user successfully", async () => {
    const newUser = {
      firstName: "Test",
      lastName: "User",
      email: "test.user@resi.dents",
      username: "mr.test",
      password: "STRONGP4$$w0rd_",
    }
    const response = await request(app).post("/users/register").send(newUser)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("message", "User registered.")
  })

  it("should return an error if email is missing", async () => {
    const incompleteUser = {
      firstName: "Test",
      lastName: "User",
      email: "", // Email is required
      username: "testuser",
      password: "password123",
    }
    const response = await request(app).post("/users/register").send(incompleteUser)
    expect(response.status).toBe(400)
    expect(response.body).toBe("Email is required")
  })

  it("should return an error if email isnt an email", async () => {
    const incompleteUser = {
      firstName: "Invalid",
      lastName: "Email",
      email: "nope",
      username: "InvalidEmail",
      password: "STRONGP4$$w0rd_",
    }
    const response = await request(app).post("/users/register").send(incompleteUser)
    expect(response.status).toBe(400)
    expect(response.body).toBe("Invalid email address")
  })

  it("should return an error if password is weak", async () => {
    const incompleteUser = {
      firstName: "Weak",
      lastName: "Password",
      email: "weakpassword@weak.com",
      username: "weakpassword",
      password: "weak",
    }
    const response = await request(app).post("/users/register").send(incompleteUser)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("message", "Password not strong enough, try harder.")
  })
})

describe("Healthcheck Endpoint", () => {
  it("should return status 200 and a status emoji", async () => {
    const response = await request(app).get("/health")
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("status", "👌")
  })
})
