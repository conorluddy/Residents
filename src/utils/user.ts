import { faker } from '@faker-js/faker/.'
import MESSAGES from '../constants/messages'
import { User, SafeUser, PublicUser } from '../db/types'
import SERVICES from '../services'

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

export function sanitizeUsername(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric characters
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
    .slice(0, 30) // Truncate to 30 characters
}

export function generateUsername(): string {
  const adjective = faker.commerce.productAdjective()
  const chemical = faker.science.chemicalElement().name
  return sanitizeUsername(`${adjective}${chemical}`)
}

export async function generateUniqueUsername(input: string): Promise<string> {
  const sanitizedInput = input ? sanitizeUsername(input) : null
  let username: string | null = null
  let isUnique = false

  if (sanitizedInput) {
    const exists = await SERVICES.getUserByUsername(sanitizedInput)
    if (!exists) {
      return sanitizedInput
    }
  }

  while (!isUnique) {
    username = generateUsername()
    const exists = await SERVICES.getUserByUsername(username)
    if (!exists) {
      isUnique = true
    }
  }

  if (!username) {
    throw new Error(MESSAGES.ERROR_CREATING_USERNAME)
  }

  return username
}
