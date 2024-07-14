import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "./schema/index"
import dotenv from "dotenv"
dotenv.config()

const POSTGRES_PORT = 5432 // move to env

const client = new Client({
  port: POSTGRES_PORT,
  host: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

client.connect()

const db = drizzle(client, { schema, logger: process.env.POSTGRES_LOG === "true" })

export default db
