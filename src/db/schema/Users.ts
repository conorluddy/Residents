import { sql } from "drizzle-orm"
import { real } from "drizzle-orm/pg-core"
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const enumUserRole = pgEnum("userRole", [
  "owner",
  "admin",
  "moderator",
  "default",
])

export const enumUserStatus = pgEnum("userStatus", [
  "banned",
  "deleted",
  "pending",
  "rejected",
  "suspended",
  "unverified",
  "verified",
])

export const tableUsers = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
  userStatus: enumUserStatus("status").default("unverified"),
  username: text("username").unique().notNull(),
  password: text("password"),
  createdAt: timestamp("created_at").default(sql`now()`),
  role: enumUserRole("role").default("default"),
  rank: real("rank").default(1.0),
})

export const tableFederatedCredentials = pgTable("federatedCredentials", {
  user_id: serial("user_id").notNull().primaryKey(),
  provider: text("provider").notNull(),
  subject: text("subject").notNull().unique(),
})
