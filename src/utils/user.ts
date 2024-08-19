import { User, SafeUser, PublicUser } from "../db/types"

/**
 * Remove the password from a user object.
 * Ideally password will never be SELECTed from the
 * database though and we should be able to drop this.
 */
export function userToSafeUser(user: User): SafeUser {
  const { password, ...safeUser } = user
  return safeUser
}

/**
 * Strip any user objects down to just the Public safe fields
 */
export function userToPublicUser(user: User | SafeUser | PublicUser): PublicUser {
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
