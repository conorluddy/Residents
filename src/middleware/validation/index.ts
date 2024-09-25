import { RequestHandler } from 'express'
import validateEmail from './validateEmail'
import validateTokenId from './validateTokenId'
import validateUserMeta from './validateUserMeta'
// TODO: Validate Password Strength

const VALIDATE: Record<string, RequestHandler> = {
  email: validateEmail,
  tokenId: validateTokenId,
  userMeta: validateUserMeta,
}

export default VALIDATE
