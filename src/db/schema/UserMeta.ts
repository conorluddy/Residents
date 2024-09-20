import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { tableUsers } from './Users'

/**
 * This table is used to store additional user information depending on the
 * application's needs. This keeps the main users table clean and simple.
 */
const tableUserMeta = pgTable('userMeta', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull().unique(), // FKey to users table

  // Add fields that would be specific to your user needs.
  // "Rank" could be used for anything from martial arts to reddit-style karma.
  // "ReferredBy" could be used to track who referred a user to your app.
  // DOB etc. could be added here too.

  metaItem: text('meta_item'), //   Sample
  // rank: real("rank").default(1.0), // Sample
  // referredBy: text("referred_by"), // Sample
})

const usersMetaRelations = relations(tableUserMeta, ({ one }) => ({
  user: one(tableUsers, { fields: [tableUserMeta.userId], references: [tableUsers.id] }),
}))

export { tableUserMeta, usersMetaRelations }
