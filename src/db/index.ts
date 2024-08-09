import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "./schema/index"
import dotenv from "dotenv"
dotenv.config()

const POSTGRES_PORT = 5432 // move to env

const dbClient = new Client({
  port: POSTGRES_PORT,
  host: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

if (process.env.NODE_ENV !== "test") {
  dbClient.connect()
}

const db = drizzle(dbClient, { schema, logger: process.env.POSTGRES_LOG === "true" })

export default db
export { dbClient }
