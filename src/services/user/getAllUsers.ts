import { tableUsers } from '../../db/schema'
import { SafeUser } from '../../db/types'
import db from '../../db'
import { asc } from 'drizzle-orm'

interface PaginationProps {
  offset: number
  limit: number
}

// Hard limit until we have pagination
export const DEFAULT_PAGE_SIZE_ROW_LIMIT = 100
export const MAX_PAGE_SIZE_ROW_LIMIT = 1000

const getAllUsers = async (
  { offset, limit }: PaginationProps = { offset: 0, limit: DEFAULT_PAGE_SIZE_ROW_LIMIT }
): Promise<SafeUser[]> => {
  //
  // Cap the limit - can move these limits to .env
  const cappedLimit = Math.min(limit, MAX_PAGE_SIZE_ROW_LIMIT)
  //
  const users: SafeUser[] = await db
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
    .orderBy(asc(tableUsers.id))
    .limit(cappedLimit)
    .offset(offset)

  return users
}

export { getAllUsers }
