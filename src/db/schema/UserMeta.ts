import { createId } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { pgTable, real, text } from "drizzle-orm/pg-core"
import { tableUsers } from "./Users"

const tableUserMeta = pgTable("userMeta", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id").notNull().unique(),
  rank: real("rank").default(1.0),
  referredBy: text("referred_by"),
})

const usersMetaRelations = relations(tableUserMeta, ({ one }) => ({
  user: one(tableUsers, { fields: [tableUserMeta.userId], references: [tableUsers.id] }),
}))

export { tableUserMeta, usersMetaRelations }
