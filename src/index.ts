import express from "express"
import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import { Request, Response } from "express"
import { users, User } from "./db/schema"

dotenv.config()

const client = new Client({
  port: 5432,
  host: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

client.connect()

const app = express()
const port = 3000
const db = drizzle(client)

app.use(express.json())

app.get("/", async (req: Request, res: Response) => {
  try {
    const result: User[] = await db.select().from(users)

    console.log("result", result)

    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status
  }
})

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`)
})
