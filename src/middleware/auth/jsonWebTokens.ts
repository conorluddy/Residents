import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { JWT_TOKEN_SECRET } from '../../config'
import TYPEGUARD from '../../types/typeguards'
import { REQUEST_USER } from '../../types/requestSymbols'
import { InternalServerError, UnauthorizedError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

export const authenticateToken = (req: ResidentRequest, _res: Response<ResidentResponse>, next: NextFunction): void => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const secret = JWT_TOKEN_SECRET

  if (!token) {
    throw new UnauthorizedError(MESSAGES.JWT_TOKEN_NOT_PROVIDED)
  }

  if (!secret || secret === '') {
    throw new InternalServerError(MESSAGES.JWT_SECRET_NOT_DEFINED)
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      throw new UnauthorizedError(MESSAGES.TOKEN_INVALID)
    }
    if (!TYPEGUARD.isJwtUser(user)) {
      throw new UnauthorizedError(MESSAGES.JWT_INVALID_USER_DATA)
    }
    req[REQUEST_USER] = user
    next()
  })
}
