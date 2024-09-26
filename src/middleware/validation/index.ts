import { RequestHandler } from 'express'
import validateEmail from './validateEmail'
import validateTokenId from './validateTokenId'
import validateUserMeta from './validateUserMeta'
// TODO: Validate Password Strength

interface ValidatorMap {
  email: RequestHandler
  tokenId: RequestHandler
  userMeta: RequestHandler
}

const VALIDATE: ValidatorMap = {
  email: validateEmail,
  tokenId: validateTokenId,
  userMeta: validateUserMeta,
}

export default VALIDATE
