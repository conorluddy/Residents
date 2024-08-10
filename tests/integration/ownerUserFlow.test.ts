import request from "supertest"
import { app } from "../../src"
import { dbClient } from "../../src/db"
import seedUserZero from "../../src/db/utils/seedUserZero"
import { seedUsers } from "../../src/db/utils/seedUsers"

/**
 * - Seed the default owner user into the DB
 * - Log in as the Owner
 * - Get self/own user data
 * - Get all users
 * - Delete a user
 * - Get a specific user
 */

describe("Integration: Owner flow from seeded default owner", () => {
  let jwt: string

  beforeAll(async () => {
    await dbClient.connect()
    await dbClient.query("DELETE FROM users")
    await seedUserZero("resident")
    await seedUsers(50)
  })

  afterAll(async () => {
    await dbClient.query("DELETE FROM users")
    await dbClient.end()
  })

  it("Log in as the owner - Resident Zero", async () => {
    const login = {
      username: "resident",
      password: "resident",
    }
    const response = await request(app).post("/auth").send(login)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("accessToken")
    jwt = response.body.accessToken
  })

  it("Hit the /self endpoint once logged in and get own user object", async () => {
    const response = await request(app).get("/users/self").set("Authorization", `Bearer ${jwt}`)
    expect(response.body).toMatchObject({
      firstName: "Resident",
      lastName: "Zero",
      username: "resident",
    })
    expect(response.status).toBe(200)
  })

  it("Hit the /getAllUsers endpoint once logged in and get all of the users back", async () => {
    const response = await request(app).get("/users").set("Authorization", `Bearer ${jwt}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(61) // 10 seeded users + the owner
  })

  it("Call getAllUsers again and delete one of them", async () => {
    const usersResponse = await request(app).get("/users").set("Authorization", `Bearer ${jwt}`)
    const userIdToDelete = usersResponse.body[3]?.id
    const deleteResponse = await request(app)
      .delete("/users/" + userIdToDelete)
      .set("Authorization", `Bearer ${jwt}`)
    expect(deleteResponse.status).toBe(200)
    expect(deleteResponse.body).toMatchObject({ message: `User ${userIdToDelete} deleted` })
  })

  it("Call getAllUsers again and then get a specific one", async () => {
    const usersResponse = await request(app).get("/users").set("Authorization", `Bearer ${jwt}`)
    const userIdToGet = usersResponse.body[5]?.id
    const userResponse = await request(app)
      .get("/users/" + userIdToGet)
      .set("Authorization", `Bearer ${jwt}`)
    expect(userResponse.status).toBe(200)
    expect(userResponse.body).toMatchObject([
      {
        id: usersResponse.body[5]?.id,
        firstName: usersResponse.body[5].firstName,
        lastName: usersResponse.body[5].lastName,
      },
    ])
  })
})
