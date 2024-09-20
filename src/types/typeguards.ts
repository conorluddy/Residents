import { PublicUser, SafeUser } from '../db/types'

// Need to strip this back to id and role and maybe name

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJwtUser(jwt: any): jwt is SafeUser {
  return (
    typeof jwt === 'object' &&
    jwt !== null &&
    typeof jwt.iat === 'number' &&
    typeof jwt.exp === 'number' &&
    typeof jwt.id === 'string' &&
    typeof jwt.username === 'string' &&
    typeof jwt.email === 'string' &&
    typeof jwt.role === 'string' &&
    (typeof jwt.firstName === 'string' || jwt.firstName === undefined) &&
    (typeof jwt.lastName === 'string' || jwt.lastName === undefined)
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSafeUser(user: any): user is SafeUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.id === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.role === 'string' &&
    (typeof user.firstName === 'string' || user.firstName === undefined) &&
    (typeof user.lastName === 'string' || user.lastName === undefined) &&
    (typeof user.status === 'string' || user.status === undefined) &&
    (user.createdAt instanceof Date || typeof user.createdAt === 'string') &&
    (user.deletedAt instanceof Date || user.deletedAt === undefined || typeof user.deletedAt === 'string')
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPublicUser(user: any): user is PublicUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.id === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.role === 'string' &&
    (typeof user.firstName === 'string' || user.firstName === undefined) &&
    (typeof user.lastName === 'string' || user.lastName === undefined)
  )
}

const TYPEGUARD = { isSafeUser, isPublicUser, isJwtUser }

export default TYPEGUARD
