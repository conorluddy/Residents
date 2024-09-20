import jwt from 'jsonwebtoken'
import { JWT_TOKEN_SECRET } from '../../config'

const JWT_XSRF_TOKEN_EXPIRY = '1d' // Make me configurable - should probably match refresh token expiry
const JWT_XSRF_TOKEN_DATA = { XSRF_TOKEN: '🔒' }

const generateXsrfToken = (): string => {
  const secret = JWT_TOKEN_SECRET
  if (!secret) {
    throw new Error('JWT secret not found')
  }
  return jwt.sign(JWT_XSRF_TOKEN_DATA, secret, {
    expiresIn: JWT_XSRF_TOKEN_EXPIRY,
  })
}

export default generateXsrfToken
export { JWT_XSRF_TOKEN_DATA }
