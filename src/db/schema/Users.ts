import { relations, sql } from "drizzle-orm"
import { real } from "drizzle-orm/pg-core"
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { ROLES_ARRAY, STATUS_ARRAY, ROLES, STATUS } from "../../constants/database"
import { tableTokens } from "./Tokens"
import { tableUserMeta } from "./UserMeta"

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
  password: text("password"),
  status: enumUserStatus("status").default(STATUS.UNVERIFIED),
  createdAt: timestamp("created_at").default(sql`now()`),
  deletedAt: timestamp("deleted_at"),
})

const usersRelations = relations(tableUsers, ({ one, many }) => ({
  meta: one(tableUserMeta, { fields: [tableUsers.id], references: [tableUserMeta.userId] }),
  tokens: many(tableTokens),
}))

export { enumUserRole, enumUserStatus, tableUsers, usersRelations }
