import { createId } from "@paralleldrive/cuid2"
import { sql } from "drizzle-orm"
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { ROLES_ARRAY } from "../../constants/database"

const enumTokenType = pgEnum("tokenType", ROLES_ARRAY)

const tableTokens = pgTable("tokens", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  user_id: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  type: enumTokenType("type"),
  used: boolean("used").default(false),
  created_at: timestamp("created_at").default(sql`now()`),
  expires_at: timestamp("created_at").default(sql`now()`),
})

export { enumTokenType, tableTokens }
