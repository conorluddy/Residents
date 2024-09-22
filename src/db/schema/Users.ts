import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { ROLES, ROLES_ARRAY, STATUS, STATUS_ARRAY } from '../../constants/database'
import { tableTokens } from './Tokens'
import { tableUserMeta } from './UserMeta'

const enumUserRole = pgEnum('userRole', ROLES_ARRAY)
const enumUserStatus = pgEnum('userStatus', STATUS_ARRAY)

const tableUsers = pgTable(
  'users',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    username: text('username').unique().notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    email: text('email').unique().notNull(),
    role: enumUserRole('role').default(ROLES.DEFAULT),
    password: text('password'),
    status: enumUserStatus('status').default(STATUS.UNVERIFIED),
    createdAt: timestamp('created_at').default(sql`now()`),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    usernameIdx: index('username_idx').on(table.username),
    emailIdx: index('email_idx').on(table.email),
  })
)

// TODO: Deleted viewUsers - revisit sometime

const usersRelations = relations(tableUsers, ({ one, many }) => ({
  meta: one(tableUserMeta, { fields: [tableUsers.id], references: [tableUserMeta.userId] }),
  tokens: many(tableTokens),
}))

export { enumUserRole, enumUserStatus, tableUsers, usersRelations }
