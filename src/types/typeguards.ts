import { JwtPayload } from 'jsonwebtoken'
import { PublicUser, SafeUser } from '../db/types'

function isJwtUser(jwt: unknown): jwt is SafeUser {
  if (typeof jwt !== 'object' || jwt === null) {
    return false
  }
  const maybeJwt = jwt as Partial<SafeUser> & Partial<JwtPayload>
  return (
    typeof maybeJwt.iat === 'number' &&
    typeof maybeJwt.exp === 'number' &&
    typeof maybeJwt.id === 'string' &&
    typeof maybeJwt.username === 'string' &&
    typeof maybeJwt.email === 'string' &&
    typeof maybeJwt.role === 'string' &&
    (typeof maybeJwt.firstName === 'string' || maybeJwt.firstName === undefined) &&
    (typeof maybeJwt.lastName === 'string' || maybeJwt.lastName === undefined)
  )
}

function isSafeUser(user: unknown): user is SafeUser {
  if (typeof user !== 'object' || user === null) {
    return false
  }
  const maybeUser = user as Partial<SafeUser> & Partial<JwtPayload>
  return (
    typeof maybeUser.id === 'string' &&
    typeof maybeUser.username === 'string' &&
    typeof maybeUser.email === 'string' &&
    typeof maybeUser.role === 'string' &&
    (typeof maybeUser.firstName === 'string' || maybeUser.firstName === undefined) &&
    (typeof maybeUser.lastName === 'string' || maybeUser.lastName === undefined) &&
    (typeof maybeUser.status === 'string' || maybeUser.status === undefined) &&
    (maybeUser.createdAt instanceof Date || typeof maybeUser.createdAt === 'string') &&
    (maybeUser.deletedAt instanceof Date ||
      maybeUser.deletedAt === undefined ||
      typeof maybeUser.deletedAt === 'string')
  )
}

function isPublicUser(user: unknown): user is PublicUser {
  if (typeof user !== 'object' || user === null) {
    return false
  }
  const maybePublicUser = user as Partial<PublicUser> & Partial<JwtPayload>
  return (
    typeof maybePublicUser.id === 'string' &&
    typeof maybePublicUser.username === 'string' &&
    typeof maybePublicUser.email === 'string' &&
    typeof maybePublicUser.role === 'string' &&
    (typeof maybePublicUser.firstName === 'string' || maybePublicUser.firstName === undefined) &&
    (typeof maybePublicUser.lastName === 'string' || maybePublicUser.lastName === undefined)
  )
}

const TYPEGUARD = { isSafeUser, isPublicUser, isJwtUser }

export default TYPEGUARD
