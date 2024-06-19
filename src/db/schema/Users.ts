import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const enumUserRole = pgEnum("userRole", [
  "owner",
  "admin",
  "moderator",
  "default",
])

export const enumUserVerification = pgEnum("userVerification", [
  "unverified",
  "pending",
  "verified",
  "rejected",
  "banned",
])

export const tableUsers = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
  email_verified:
    enumUserVerification("userVerification").default("unverified"),
  username: text("username").unique().notNull(),
  password: text("password"),
  createdAt: timestamp("created_at").default(sql`now()`),
  role: enumUserRole("userRole").default("default"),
})

export const tableFederatedCredentials = pgTable("federatedCredentials", {
  user_id: serial("user_id").notNull().primaryKey(),
  provider: text("provider").notNull(),
  subject: text("subject").notNull().unique(),
})

export type User = InferSelectModel<typeof tableUsers>
export type NewUser = InferInsertModel<typeof tableUsers>

export type FederatedCredentials = InferSelectModel<
  typeof tableFederatedCredentials
>
export type NewFederatedCredentials = InferInsertModel<
  typeof tableFederatedCredentials
>
