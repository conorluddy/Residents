import db from "../../db"
import { eq } from "drizzle-orm"
import { isEmail } from "validator"
import { tableUsers } from "../../db/schema"
import { SafeUser } from "../../db/types"
import { BadRequestError } from "../../errors"

const getUserByEmail = async (email: string): Promise<SafeUser | null> => {
  if (!email) throw new BadRequestError("No email provided")
  if (!isEmail(email)) throw new BadRequestError("Invalid email provided")

  const [user] = await db
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
    .where(eq(tableUsers.email, email.toLowerCase()))

  return user
}

export { getUserByEmail }
