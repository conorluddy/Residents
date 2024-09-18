import { NextFunction, Request, RequestHandler, Response } from 'express'
import SERVICES from '../../services'
import { REQUEST_EMAIL, REQUEST_USER } from '../../types/requestSymbols'
import { BadRequestError } from '../../errors'

/**
 * Middleware for finding a user by their email address.
 * Ensure that the email is validated before using this middleware -
 * (req[REQUEST_EMAIL] should only ever have been set with a validated email)
 */
const findUserByValidEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const email = req[REQUEST_EMAIL]

  if (!email) {
    throw new BadRequestError('Invalid email.')
  }

  const user = await SERVICES.getUserByEmail(email)

  if (!user) {
    throw new BadRequestError('User not found.')
  }

  req[REQUEST_USER] = user
  next()
}

export default findUserByValidEmail
