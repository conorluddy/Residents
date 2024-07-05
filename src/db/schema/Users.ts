import { relations, sql } from "drizzle-orm"
import { real } from "drizzle-orm/pg-core"
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { ROLES_ARRAY, STATUS_ARRAY, ROLES, STATUS } from "../../constants/database"
import { tableTokens } from "./Tokens"

const enumUserRole = pgEnum("userRole", ROLES_ARRAY)
const enumUserStatus = pgEnum("userStatus", STATUS_ARRAY)

const tableUsers = pgTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  username: text("username").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
  role: enumUserRole("role").default(ROLES.DEFAULT),
  rank: real("rank").default(1.0),
  password: text("password"),
  status: enumUserStatus("status").default(STATUS.UNVERIFIED),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").default(sql`now()`),
  deletedAt: timestamp("deleted_at"),
})

const tableFederatedCredentials = pgTable("federatedCredentials", {
  user_id: text("user_id").notNull().primaryKey(),
  provider: text("provider").notNull(),
  subject: text("subject").notNull().unique(),
})

const usersRelations = relations(tableUsers, ({ many }) => ({
  tokens: many(tableTokens),
}))

export { enumUserRole, enumUserStatus, tableUsers, tableFederatedCredentials, usersRelations }
