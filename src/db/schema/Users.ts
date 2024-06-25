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
  username: text("username").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
  role: enumUserRole("role").default("default"),
  rank: real("rank").default(1.0),
  password: text("password"),
  userStatus: enumUserStatus("status").default("unverified"),
  createdAt: timestamp("created_at").default(sql`now()`),
})

export const tableFederatedCredentials = pgTable("federatedCredentials", {
  user_id: serial("user_id").notNull().primaryKey(),
  provider: text("provider").notNull(),
  subject: text("subject").notNull().unique(),
})
