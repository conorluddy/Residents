import { Router } from "express"
import { NewUser, User, users } from "../db/schema"
import { createHash, validateHash } from "../utils/crypt"
import { eq } from "drizzle-orm"
import db from "../db/connection"

const router = Router()

/**
 * Get all users
 */
router.get("/", async (req, res) => {
  try {
    const result: User[] = await db.select().from(users)
    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status
  }
})

/**
 * Register a new user
 */
router.post("/register", async ({ body }, res) => {
  try {
    // const { db } = req // Need to get types working for this approach
    const {
      username,
      firstName,
      lastName,
      email,
      password: plainPassword,
    } = body
    const password = await createHash(plainPassword)
    const user: NewUser = {
      firstName,
      lastName,
      email,
      username,
      password,
    }
    await db.insert(users).values(user).returning()
    res.status(201).send("User registered")
  } catch (error) {
    res.status(500).send("Error registering user")
  }
})

/**
 * Login a user
 */
router.post("/login", async ({ body }, res) => {
  try {
    const { username, password } = body
    const results: User[] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))

    if (results[0] && (await validateHash(password, results[0].password))) {
      res.send("Login successful")
    } else {
      res.status(400).send("Not today, buddy")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Error logging in")
  }
})

export default router
export { router as usersRouter }
