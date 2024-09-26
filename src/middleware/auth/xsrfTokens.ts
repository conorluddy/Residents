import { NextFunction, Response } from 'express'
import { JWT_TOKEN_SECRET } from '../../config'
import { UnauthorizedError } from '../../errors'
import jwt from 'jsonwebtoken'
import generateXsrfToken from '../util/xsrfToken'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

const xsrfTokens = (req: ResidentRequest, res: Response<ResidentResponse>, next: NextFunction): void => {
  // Return as early as possible, this will be called on most requests and only need apply to mutations
  if (req.method === 'GET') {
    return next()
  }
  if (req.path === '/auth') {
    return next()
  }
  if (req.path === '/users/register') {
    return next()
  }
  if (process.env.NODE_ENV === 'test') {
    return next()
  }

  const secret = JWT_TOKEN_SECRET
  if (!secret) {
    throw new Error(MESSAGES.JWT_SECRET_NOT_FOUND)
  }

  // Look for token in cookies, if not found, generate a new one
  let xsrfToken: string = req.cookies['xsrfToken']

  if (!xsrfToken) {
    xsrfToken = generateXsrfToken()
    res.cookie('xsrfToken', xsrfToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
  }

  // XSRF-Token should actually be checked in the headers.
  // Client should take it from cookie and add it to headers.
  const requestHeadersXsrfToken: string = req.cookies?.['xsrfToken']

  if (!requestHeadersXsrfToken) {
    throw new UnauthorizedError(MESSAGES.XSRF_TOKEN_REQUIRED)
  } else {
    jwt.verify(String(requestHeadersXsrfToken), secret, (err) => {
      if (err) {
        throw new UnauthorizedError(MESSAGES.XSRF_TOKEN_INVALID)
      }
      next()
    })
  }
}

export default xsrfTokens
