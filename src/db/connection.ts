import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import dotenv from "dotenv"
dotenv.config()

const client = new Client({
  port: 5432,
  host: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

client.connect()
const db = drizzle(client)

export default db
