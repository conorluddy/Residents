import jwt from 'jsonwebtoken'
import { EXPIRATION_XSRF_TOKEN, JWT_TOKEN_SECRET } from '../../config'
import MESSAGES from '../../constants/messages'

const JWT_XSRF_TOKEN_DATA = { XSRF_TOKEN: '🔒' } // Content doesnt really matter, right?

const generateXsrfToken = (): string => {
  const secret = JWT_TOKEN_SECRET
  if (!secret) {
    throw new Error(MESSAGES.JWT_SECRET_NOT_FOUND)
  }
  return jwt.sign(JWT_XSRF_TOKEN_DATA, secret, {
    expiresIn: EXPIRATION_XSRF_TOKEN,
  })
}

export default generateXsrfToken
export { JWT_XSRF_TOKEN_DATA }
