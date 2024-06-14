import { Router } from "express"
import { User, users } from "../db/schema"

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

router.post("/", async (req, res) => {})

export default router
export { router as usersRouter }
