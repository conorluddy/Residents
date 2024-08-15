import request from "supertest"
import { app } from "../../src"
import { dbClient } from "../../src/db"

/**
 * - Create/Register a new user
 * - Attempt to get data while not authorised
 * - Log in with the new user
 * - Reattempt to get data while authorised
 */
describe("Integration: Default User flow", () => {
  let jwt: string

  beforeAll(async () => {
    await dbClient.connect()
    await dbClient.query("DELETE FROM users")
  })

  afterAll(async () => {
    await dbClient.query("DELETE FROM users")
    await dbClient.end()
  })

  it("Create a new user", async () => {
    const newUser = {
      firstName: "mrhappy",
      lastName: "mrhappy",
      email: "mrhappy@resi.dents",
      username: "mrhappy",
      password: "STRONGP4$$w0rd_",
    }
    const response = await request(app).post("/users/register").send(newUser)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("message", "User registered.")
  })

  it("Tries to hit a private endpoint without a token and gets bounced", async () => {
    const response = await request(app).get("/users/self")
    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({
      message: "Token is required",
    })
  })

  it("Log in with the new user", async () => {
    const login = {
      username: "mrhappy",
      password: "STRONGP4$$w0rd_",
    }
    const response = await request(app).post("/auth").send(login)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("accessToken")
    jwt = response.body.accessToken
  })

  it("Hit the /self endpoint once logged in and get own user object", async () => {
    const response = await request(app).get("/users/self").set("Authorization", `Bearer ${jwt}`)
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      username: "mrhappy",
      email: "mrhappy@resi.dents",
      firstName: "mrhappy",
      lastName: "mrhappy",
    })
  })
})
