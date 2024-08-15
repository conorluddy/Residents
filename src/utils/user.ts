import { User, SafeUser, PublicUser } from "../db/types"

export function userToSafeUser(user: User): SafeUser {
  const { password, ...safeUser } = user
  return safeUser
}

export function userToPublicUser(user: Partial<User>): PublicUser {
  const { username, firstName, lastName, email, role, id } = user

  if (!username || !firstName || !lastName || !email || !role || !id) {
    throw new Error("User is missing required fields")
  }

  return {
    username,
    firstName,
    lastName,
    email,
    role,
    id,
  }
}
