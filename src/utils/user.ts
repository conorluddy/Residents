import MESSAGES from '../constants/messages'
import { User, SafeUser, PublicUser } from '../db/types'

/**
 * Strip any user objects down to just the Public safe fields
 */
export function userToPublicUser(user: User | SafeUser | PublicUser): PublicUser {
  const { username, firstName, lastName, email, role, id } = user
  if (!username || !firstName || !lastName || !email || !role || !id) {
    throw new Error(MESSAGES.USER_MISSING_REQUIRED_FIELDS)
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
