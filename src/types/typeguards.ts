import { JwtPayload } from 'jsonwebtoken'
import { PublicUser, SafeUser } from '../db/types'
import { SendGridError } from '.'
import { ROLES, STATUS } from '../constants/database'

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

function isSendGridError(error: unknown): error is SendGridError {
  if (typeof error !== 'object' || error === null) {
    return false
  }
  const { message, code, response } = error as Partial<SendGridError>
  return (
    typeof message === 'string' &&
    (typeof code === 'string' || typeof code === 'number') &&
    typeof response === 'object' &&
    response !== null &&
    'body' in response &&
    typeof response.body === 'object' &&
    response.body !== null &&
    'errors' in response.body &&
    Array.isArray(response.body.errors)
  )
}

/**
 * isValidRole
 * @param role
 */
export function isValidRole(role: string): role is ROLES {
  return Object.values(ROLES).includes(role as ROLES)
}

/**
 * isValidStatus
 * @param status
 */
export function isValidStatus(status: string): status is STATUS {
  return Object.values(STATUS).includes(status as STATUS)
}

const TYPEGUARD = { isSafeUser, isPublicUser, isJwtUser, isSendGridError, isValidRole, isValidStatus }

export default TYPEGUARD
