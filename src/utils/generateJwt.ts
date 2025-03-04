import jwt from 'jsonwebtoken'
import { EXPIRATION_JWT_TOKEN, JWT_TOKEN_SECRET } from '../config'
import { StringValue } from 'ms' // This is a jsonwebtoken dep
import { PublicUser, SafeUser, User } from '../db/types'
import { userToPublicUser } from './user'
import MESSAGES from '../constants/messages'

const DEFAULT_EXPIRATION = '1h'

export const generateJwtFromUser = (user: User | SafeUser | PublicUser, expiryOverride?: string): string => {
  if (!JWT_TOKEN_SECRET) {
    throw new Error(MESSAGES.JWT_SECRET_NOT_FOUND)
  }
  return jwt.sign(userToPublicUser(user), JWT_TOKEN_SECRET, {
    expiresIn: (expiryOverride ?? EXPIRATION_JWT_TOKEN ?? DEFAULT_EXPIRATION) as StringValue,
  })
}
