import request from "supertest"
import { app } from "../../src"
import { dbClient } from "../../src/db"

/**
 * NOTE: This test will fail if the database is not seeded with the default owner.
 * The default owner is seeded by running the seedUserZero script in the db/utils folder.
 * The script is run with the command `npm run seed:owner'
 */
describe("Integration: Owner flow from seeded default owner", () => {
  let jwt: string
  let userTwoId: string

  beforeAll(async () => {
    await dbClient.connect()
  })

  afterAll(async () => await dbClient.end())

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
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      firstName: "Resident",
      lastName: "Zero",
      username: "resident",
    })
  })

  it("Hit the /getAllUsers endpoint once logged in and get all of the users back", async () => {
    const response = await request(app).get("/users").set("Authorization", `Bearer ${jwt}`)
    userTwoId = response.body[1]?.id
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(11) // 10 seeded users + the owner
  })
})
