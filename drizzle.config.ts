import { defineConfig, Config } from "drizzle-kit"
import dotenv from "dotenv"
dotenv.config()

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}` +
      `@${process.env.POSTGRES_URL}:${5432}/${process.env.POSTGRES_DB}`,
  },
} as Config)
