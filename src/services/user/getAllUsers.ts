import db from '../../db'
import { tableUsers } from '../../db/schema'
import { SafeUser } from '../../db/types'
import { asc, ilike, eq, and, SQL } from 'drizzle-orm'
import { ROLES, STATUS } from '../../constants/database'

interface GetAllUsersProps {
  offset: number
  limit: number
  firstName?: string
  lastName?: string
  email?: string
  username?: string
  role?: ROLES
  status?: STATUS
}

// Hard limit until we have pagination
export const DEFAULT_PAGE_SIZE_ROW_LIMIT = 100
export const MAX_PAGE_SIZE_ROW_LIMIT = 1000

// TODO: Look into using https://orm.drizzle.team/docs/select#conditional-select
// to maybe filter the returned columns based on some RBAC definitions
// TODO https://orm.drizzle.team/docs/operators#arrayoverlaps for roles and status

/**
 * Get all users
 */
const getAllUsers = async (
  { offset, limit, firstName, lastName, email, username, role, status }: GetAllUsersProps = {
    offset: 0,
    limit: DEFAULT_PAGE_SIZE_ROW_LIMIT,
  }
): Promise<SafeUser[]> => {
  const cappedLimit = Math.min(limit, MAX_PAGE_SIZE_ROW_LIMIT) // Cap the limit - can move these limits to .env

  const conditions: SQL<unknown>[] = []

  if (firstName) {
    conditions.push(ilike(tableUsers.firstName, `%${firstName}%`))
  }
  if (lastName) {
    conditions.push(ilike(tableUsers.lastName, `%${lastName}%`))
  }
  if (email) {
    conditions.push(ilike(tableUsers.email, `%${email}%`))
  }
  if (username) {
    conditions.push(ilike(tableUsers.username, `%${username}%`))
  }
  if (role) {
    conditions.push(eq(tableUsers.role, role))
  }
  if (status) {
    conditions.push(eq(tableUsers.status, status))
  }

  // TODO: Search by fullname!

  const query = db
    .select({
      id: tableUsers.id,
      username: tableUsers.username,
      firstName: tableUsers.firstName,
      lastName: tableUsers.lastName,
      email: tableUsers.email,
      role: tableUsers.role,
      status: tableUsers.status,
      createdAt: tableUsers.createdAt,
      deletedAt: tableUsers.deletedAt,
    })
    .from(tableUsers)
    .where(and(...conditions))
    .orderBy(asc(tableUsers.id))
    .limit(cappedLimit)
    .offset(offset)

  const users: SafeUser[] = await query

  return users
}

export { getAllUsers, GetAllUsersProps }
