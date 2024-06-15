import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("userRole", [
  "owner",
  "admin",
  "moderator",
  "default",
])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  role: userRoleEnum("userRole").default("default"),
})

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
