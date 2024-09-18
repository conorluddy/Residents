import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { TOKEN_TYPE_ARRAY } from '../../constants/database'
import { tableUsers } from './Users'

const enumTokenType = pgEnum('tokenType', TOKEN_TYPE_ARRAY)

const tableTokens = pgTable('tokens', {
  id: text('id')
    .unique()
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  type: enumTokenType('type'),
  used: boolean('used').default(false),
  createdAt: timestamp('created_at').default(sql`now()`),
  expiresAt: timestamp('expires_at')
    .notNull()
    .default(sql`now()`), // Possibly redundant, but we'll see. Prevent open-ended tokens. notNull should be enough.
})

const tokensRelations = relations(tableTokens, ({ one }) => ({
  user: one(tableUsers, { fields: [tableTokens.userId], references: [tableUsers.id] }),
}))

export { enumTokenType, tableTokens, tokensRelations }
