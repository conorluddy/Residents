import { sql } from "drizzle-orm"
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
  userStatus: enumUserStatus("user_status").default("unverified"),
  username: text("username").unique().notNull(),
  password: text("password"),
  createdAt: timestamp("created_at").default(sql`now()`),
  role: enumUserRole("user_role").default("default"),
})

export const tableFederatedCredentials = pgTable("federatedCredentials", {
  user_id: serial("user_id").notNull().primaryKey(),
  provider: text("provider").notNull(),
  subject: text("subject").notNull().unique(),
})
