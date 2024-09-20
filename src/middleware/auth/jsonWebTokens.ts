import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { JWT_TOKEN_SECRET } from '../../config'
import TYPEGUARD from '../../types/typeguards'
import { REQUEST_USER } from '../../types/requestSymbols'
import { InternalServerError, UnauthorizedError } from '../../errors'
import MESSAGES from '../../constants/messages'

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const secret = JWT_TOKEN_SECRET

  if (!token) {
    throw new UnauthorizedError('JWT token is not provided in the request headers.')
  }

  if (!secret || secret === '') {
    throw new InternalServerError('JWT token secret is not defined in your environment variables.')
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      throw new UnauthorizedError(MESSAGES.TOKEN_INVALID)
    }
    if (!TYPEGUARD.isJwtUser(user)) {
      throw new UnauthorizedError('JWT contains invalid user data.')
    }
    req[REQUEST_USER] = user
    next()
  })
}
