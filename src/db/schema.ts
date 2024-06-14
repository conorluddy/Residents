import { sql } from "drizzle-orm"
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  username: text("username"),
  password: text("password"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
