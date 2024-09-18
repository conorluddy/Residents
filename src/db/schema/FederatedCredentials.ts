import { pgTable, text } from 'drizzle-orm/pg-core'

const tableFederatedCredentials = pgTable('federatedCredentials', {
  userId: text('user_id').notNull().primaryKey(),
  provider: text('provider').notNull(),
  subject: text('subject').notNull().unique(),
})

export { tableFederatedCredentials }
