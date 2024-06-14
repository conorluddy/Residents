import { Router } from "express"
import { NewUser, User, users } from "../db/schema"
import { createHash, validateHash } from "../utils/crypt"
import { eq } from "drizzle-orm"

const router = Router()

router.get("/", async ({ db }, res) => {
  try {
    const result: User[] = await db.select().from(users)
    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status
  }
})

router.post("/register", async (req, res) => {
  try {
    const { db } = req
    const { username, password, firstName, lastName, email } = req.body
    const hashedPassword = await createHash(password)
    const user: NewUser = {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    }
    await db.insert(users).values(user).returning()
    res.status(201).send("User registered")
  } catch (error) {
    res.status(500).send("Error registering user")
  }
})

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const results: User[] = await req.db
      .select()
      .from(users)
      .where(eq(users.username, username))

    if (results[0] && (await validateHash(password, results[0].password))) {
      res.send("Login successful")
    } else {
      res.status(400).send("Invalid credentials")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Error logging in")
  }
})

export default router
export { router as usersRouter }
