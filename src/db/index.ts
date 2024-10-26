import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from './schema/index'
import { POSTGRES_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } from '../config'

import dotenv from 'dotenv'
dotenv.config()

const DEFAULT_POSTGRES_PORT = '5432'

const postgresDatabaseClient = new Client({
  port: parseInt(POSTGRES_PORT ?? DEFAULT_POSTGRES_PORT, 10),
  host: POSTGRES_URL,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
})

if (process.env.NODE_ENV !== 'test') {
  postgresDatabaseClient.connect()
}

const db = drizzle(postgresDatabaseClient, { schema, logger: process.env.POSTGRES_LOG === 'true' })

export default db
export { postgresDatabaseClient, db }
